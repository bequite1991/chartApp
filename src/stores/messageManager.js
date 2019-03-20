import {observable, computed, toJS, autorun} from 'mobx';

import EventEmitter from 'events';

import mqttWorker from './mqttWorker';

import mqttMessage from './mqttMessage';

import {PROTOCAL_REQUEST} from '../datacenter/protocol';

import {SERVER_OPTIONS} from '../datacenter/serverConfig';

import md5 from 'js-md5';

import {encode, timestampToTime} from '../lib/helper.js';

let Base64 = require ('js-base64').Base64;

class MessageManager extends EventEmitter {
  cmdList = [];
  subscribe = [];
  messageEmitterTimer = null;
  serverOptionsValue = SERVER_OPTIONS;
  timestamp = new Date ().getTime ();

  constructor () {
    super ();
    // let options = {
    //     ip: '121.43.165.110',
    //     port: 3994,
    //     userName: '15051841028',
    //     passWord: 'huibao1841028',
    //     clientName: 'JSClient-Demo-' + new Date ().toLocaleTimeString (),
    //     cleanSession: true,
    //     timeout: 30,
    //     keepAliveInterval: 30,
    //   };

    let options = this.serverOptionsValue;
    options.clientName =
      options.clientName + '-' + new Date ().toLocaleTimeString ();

    let protocal_value = Object.values (PROTOCAL_REQUEST);
    protocal_value.forEach (item => {
      this.subscribe.push (item + '/' + options.userName);
    });

    mqttWorker.emit ('session:init', this.subscribe);
    mqttWorker.emit ('session:connect', options);

    this.on ('register', args => {
      console.info ('注册消息:' + args.cmd);
      this.addCommand (args.cmd);
    });

    this.on ('unregister', args => {
      console.info ('取消注册消息:' + args.cmd);
      this.removeCommand (args.cmd);
    });

    this.messageEmitterTimer = setInterval (() => {
      this.messageEmitter ();
    }, 3000);
  }

  messageEmitter () {
    if (!this.isCmdEmpty ()) {
      this.cmdList.forEach (cmd => {
        //debugger;
        if (this.hasTopic (cmd)) {
          let topic =
            PROTOCAL_REQUEST[cmd] + '/' + this.serverOptionsValue.userName;
          let topic_custom = PROTOCAL_REQUEST[cmd].split ('/')[3];
          let username = this.serverOptionsValue.userName;
          let message_num = '0001';
          let message = this.packetMessage (
            cmd,
            topic_custom,
            this.serverOptionsValue.passWord,
            new Date ().getTime (),
            message_num
          );
          console.info ('topic:' + topic);
          console.info ('packet message:' + message);
          mqttWorker.emit ('session:publish', {topic: topic, message: message});

          //this.cmdList = [];
        }
      });
    }
  }

  hasTopic (cmd) {
    return PROTOCAL_REQUEST[cmd];
  }

  packetMessage (cmd, topic_custom, salt, timestamp, message_num) {
    let key = md5 (salt).toUpperCase ();
    let token = Base64.encode (JSON.stringify({cmd: cmd, key: key, timestamp: timestamp}));
    console.info (
      'cmd:' +
        cmd +
        ' salt:' +
        salt +
        ' timestamp:' +
        timestamp +
        ' key:' +
        key +
        ' token:' +
        token
    );
    let messageIndex = 0;
    let num_id = timestampToTime (timestamp) + message_num;
    num_id = num_id.substring (0, 20);
    return encode (
      cmd,
      num_id,
      timestamp,
      'inshn_dtimao.huibao.resp.' + topic_custom,
      200,
      token,
      '',
      []
    );
  }

  reset () {
    this.cmdList = [];
    this.subscribe = [];
  }

  isCmdEmpty () {
    return this.cmdList.length == 0;
  }

  hasCommand (cmd) {
    let index = -1;
    let id = -1;
    this.cmdList.forEach (item => {
      ++index;
      if (item == cmd) {
        id = index;
        return;
      }
    });

    return id;
  }

  addCommand (cmd) {
    let index = this.hasCommand (cmd);
    if (index < 0) {
      this.cmdList.push (cmd);
    }
  }

  removeCommand (cmd) {
    // let index = this.hasCommand(cmd);
    // if(index > -1){
    //     this.cmdList.remove(index);
    // }
  }
}

export default new MessageManager ();
