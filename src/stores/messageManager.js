import {observable, computed, toJS, autorun} from 'mobx';

import EventEmitter from 'events';

import mqttWorker from './mqttWorker';

import mqttMessage from './mqttMessage';

import {PROTOCAL_REQUEST, PROTOCAL_RESPONSE} from '../datacenter/protocol';

import {SERVER_OPTIONS} from '../datacenter/serverConfig';

import md5 from 'js-md5';

import {encode, timestampToTime} from '../lib/helper.js';

import QueryString from 'query-string';

let Base64 = require ('js-base64').Base64;

class MessageManager extends EventEmitter {
  //commandList = [];
  commandMap = new Map ();
  subscribe = [];
  removeUUIDList = [];
  messageEmitterTimer = null;
  parserLoopTimer = null;

  serverOptionsValue = SERVER_OPTIONS;
  timestamp = new Date ().getTime ();

  messageList = [];

  isdetail = false;

  dev_id = '';

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

    this.dev_id = QueryString.parse (window.location.search).dev_id || '';

    let options = this.serverOptionsValue;
    options.clientName =
      options.clientName + '-' + new Date ().toLocaleTimeString ();

    let protocal_value = Object.values (PROTOCAL_RESPONSE);
    protocal_value.forEach (item => {
      this.subscribe.push (item + '/' + options.userName);
    });

    mqttWorker.emit ('session:init', this.subscribe);
    mqttWorker.emit ('session:connect', options);

    this.on ('register', args => {
      console.info ('注册消息:' + args.cmd + ' uuid:' + args.uuid);

      if (args.uuid && args.uuid.length > 0) {
        this.addCommand ({
          uuid: args.uuid ? args.uuid : '',
          cmd: args.cmd,
          filter: args.filter ? args.filter : '',
        });
      }
    });

    this.on ('unregister', args => {
      console.info ('取消注册消息:' + args.cmd);
      this.removeCommand (args);
    });

    this.messageEmitterTimer = setInterval (() => {
      this.messageEmitter ();
    }, 3000);

    this.parserLoopTimer = setInterval (() => {
      this.parserLoop ();
    }, 1000);
  }

  addMessage (message) {
    if (message) {
      this.messageList.push (message);
    }
  }

  isMessageListEmpty () {
    return this.messageList.length == 0;
  }

  parserLoop () {
    if (!this.isMessageListEmpty ()) {
      let message = this.messageList[0];
      if (message) {
        this.emit (message.cmd, message);
        delete this.messageList[0];
        this.messageList.splice (0, 1);
      }
    }
  }

  messageEmitter () {
    // 移除列表数据
    let index = 0;
    let removeUUID = '';
    try {
      if (this.removeUUIDList.length > 0) {
        debugger;
        this.removeUUIDList.forEach (uuidcommand => {
          let command = this.commandMap.get (uuidcommand);
          if (command) {
            this.commandMap.delete (uuidcommand);
            console.info ('移除:' + uuidcommand);
          }
          removeUUID = uuidcommand;
        });
        //this.removeUUIDList = [];
      }
    } catch (ex) {
      console.info ('uuidcommand:' + removeUUID);
    }

    let count = this.commandMap.size;
    if (count > 0) {
      //debugger;
      this.commandMap.forEach (command => {
        this.sendCommand (command);
      });

      this.removeUUIDList = [];
      // for (let key in this.commandMap) {
      //   let command = this.commandMap[key];
      //   if (command) {
      //     this.sendCommand (command);
      //   }
      // }

      // commandList.forEach (command => {
      //   let cmd = command.cmd;
      //   let filter = command.filter ? command.filter : '';
      //   if (this.hasTopic (cmd)) {
      //     let topic =
      //       PROTOCAL_REQUEST[cmd] + '/' + this.serverOptionsValue.userName;
      //     let src_topic = PROTOCAL_RESPONSE[cmd].replace (
      //       new RegExp ('/', 'gm'),
      //       '.'
      //     ); //PROTOCAL_REQUEST[cmd].split ('/')[3];

      //     src_topic = src_topic + '.' + this.serverOptionsValue.userName;
      //     let username = this.serverOptionsValue.userName;
      //     let message_num = '0001';
      //     let message = this.packetMessage (
      //       cmd,
      //       src_topic,
      //       username,
      //       this.serverOptionsValue.passWord,
      //       new Date ().getTime (),
      //       message_num,
      //       filter
      //     );
      //     console.info ('topic:' + topic);
      //     console.info ('packet message:' + message);
      //     mqttWorker.emit ('session:publish', {topic: topic, message: message});
      //   }
      // });

      //this.cmdList = [];
    }
  }

  sendCommand (command) {
    let cmd = command.cmd;
    let filter = command.filter ? command.filter : '';
    if (this.hasTopic (cmd)) {
      let topic =
        PROTOCAL_REQUEST[cmd] + '/' + this.serverOptionsValue.userName;
      let src_topic = PROTOCAL_RESPONSE[cmd].replace (
        new RegExp ('/', 'gm'),
        '.'
      ); //PROTOCAL_REQUEST[cmd].split ('/')[3];

      src_topic = src_topic + '.' + this.serverOptionsValue.userName;
      let username = this.serverOptionsValue.userName;
      let message_num = '0001';
      let message = this.packetMessage (
        cmd,
        src_topic,
        username,
        this.serverOptionsValue.passWord,
        new Date ().getTime (),
        message_num,
        filter
      );
      console.info ('topic:' + topic);
      console.info ('packet message:' + message);
      mqttWorker.emit ('session:publish', {topic: topic, message: message});
    }
  }

  hasTopic (cmd) {
    return PROTOCAL_REQUEST[cmd];
  }

  packetMessage (cmd, src, user, salt, timestamp, message_num, filter) {
    let key = '7D13B47CEA2DC5828D6910D3C0FA31DD'; //md5 (salt).toUpperCase ();
    let token = Base64.encode (
      JSON.stringify ({cmd: cmd, key: key, timestamp: timestamp})
    );
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
        token,
      ' filter:' + filter
    );
    let messageIndex = 0;
    let num_id = timestampToTime (timestamp) + message_num;
    num_id = num_id.substring (0, 20);
    return encode (cmd, num_id, timestamp, src, user, 200, token, filter, []);
  }

  reset () {
    //this.commandList = [];
    this.commandMap.clear ();
    this.subscribe = [];
    this.messageList = [];
  }

  // isCommandEmpty () {
  //   return this.commandList.length == 0;
  // }

  hasCommand (cmd) {
    let index = -1;
    let id = -1;
    let commandList = Object.values (this.commandMap);
    commandList.forEach (item => {
      ++index;
      if (item.cmd == cmd) {
        id = index;
        return;
      }
    });

    return id;
  }

  addCommand (command) {
    if (command && command.uuid != null && command.uuid.length > 0) {
      this.commandMap.set (command.uuid + '-' + command.cmd, command);
    }

    // let index = this.hasCommand (command);
    // if (index < 0)
    // {
    //   this.commandList.push (command);
    // }
  }

  removeCommand({uuid, cmd}) {
    // let index = 0;
    // this.commandList.forEach (command => {
    //   let _uuid = command.uuid;
    //   let cmd = command.uuid;

    //   if (_uuid == uuid) {
    //   }
    //   ++index;
    // });

    this.removeUUIDList.push (uuid + '-' + cmd);
    // let index = this.hasCommand(cmd);
    // if(index > -1){
    //     this.cmdList.remove(index);
    // }
  }
}

export default new MessageManager ();
