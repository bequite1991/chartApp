import {observable, computed, toJS, autorun} from 'mobx';

import EventEmitter from 'events';

import mqttWorker from './mqttWorker';

import websocketWorker from './websocketWorker';

import mqttMessage from './mqttMessage';

import {PROTOCAL_REQUEST, PROTOCAL_RESPONSE} from '../datacenter/protocol';

import {SERVER_OPTIONS} from '../datacenter/serverConfig';

import md5 from 'js-md5';

import {encode, timestampToTime} from '../lib/helper.js';

import QueryString from 'query-string';

let Base64 = require ('js-base64').Base64;

class MessageManager extends EventEmitter {
  wsCommandMap = new Map ();

  commandMap = new Map ();

  subscribe = [];
  removeWsUUIDList = [];
  removeUUIDList = [];
  wsMessageEmitterTimer = null;
  messageEmitterTimer = null;
  parserLoopTimer = null;

  serverOptionsValue = SERVER_OPTIONS;
  timestamp = new Date ().getTime ();

  messageList = [];

  wsMessageList = [];

  isdetail = false;

  dev_id = '';

  isWSInit = false;

  isWSOpen = false;

  constructor () {
    super ();

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
      // console.info ('注册消息:' + args.cmd + ' uuid:' + args.uuid);

      if (args.uuid && args.uuid.length > 0) {
        this.addCommand ({
          uuid: args.uuid ? args.uuid : '',
          cmd: args.cmd,
          filter: args.filter ? args.filter : '',
        });
      }
    });

    this.on ('unregister', args => {
      // console.info ('取消注册消息:' + args.cmd);
      this.removeCommand (args);
    });

    this.on ('ws-register', args => {
      if (this.isWSInit == false && websocketWorker) {
        this.isWSInit = true;
        let key =
          'eyJpZCI6InllIiwia2V5IjoiNDZDQzQ1QTcyN0JFQzdERTk3RjlFNzM4QUQ0MjgxNTMiLCJwcm9qZWN0Q29kZSI6Imh1aWJhbyIsInRpbWVzdGFtcCI6IjIwMTcxMTA2MTgxNDA2In0=';
        let url = 'ws://www.dtimao.com:8088/dtimao/webSocket/';
        websocketWorker.emit ('ws-connect', {url: url, key: key});
      }

      // console.info ('ws注册消息:' + args.cmd + ' uuid:' + args.uuid);
      if (args.uuid && args.uuid.length > 0) {
        this.addWsCommand ({
          uuid: args.uuid ? args.uuid : '',
          cmd: args.cmd,
          dev_id: args.filter ? args.filter : '',
        });
      }
    });

    this.on ('ws-unregister', args => {
      debugger;
      // console.info ('取消注册消息:' + args.cmd);
      this.removeWsCommand (args);
    });

    this.on ('ws-open', args => {
      this.isWSOpen = args.isOpen ? args.isOpen : false;
    });

    this.messageEmitterTimer = setInterval (() => {
      this.messageEmitter ();
    }, 3000);

    this.parserLoopTimer = setInterval (() => {
      this.parserLoop ();
    }, 1000);

    this.wsMessageEmitterTimer = setInterval (() => {
      this.wsMessageEmitter ();
    }, 5000);
  }

  wsMessageEmitter () {
    if (!websocketWorker || this.isWSInit == false) {
      return;
    }
    // 移除列表数据
    let index = 0;
    let removeUUID = '';
    try {
      if (this.removeWsUUIDList.length > 0) {
        this.removeWsUUIDList.forEach (uuidcommand => {
          let command = this.wsCommandMap.get (uuidcommand);
          if (command) {
            this.wsCommandMap.delete (uuidcommand);
            // console.info ('移除:' + uuidcommand);
          }
          removeUUID = uuidcommand;
        });
      }
    } catch (ex) {
      // console.info ('uuidcommand:' + removeUUID);
    }

    let count = this.wsCommandMap.size;
    if (count > 0 && this.isWSOpen == true) {
      this.wsCommandMap.forEach (command => {
        this.sendWsCommand (command);
      });

      this.wsCommandMap.clear ();
    }

    if (this.removeWsUUIDList.length) {
      this.removeWsUUIDList = [];
    }
  }

  sendWsCommand (command) {
    if (command && websocketWorker) {
      websocketWorker.emit ('ws-send', {
        cmd: command.cmd,
        dev_id: command.dev_id,
      });
    }
  }

  addMessage (message) {
    if (message) {
      this.messageList.push (message);
    }
  }

  addWSMessage (message) {
    if (message) {
      this.wsMessageList.push (message);
    }
  }

  isMessageListEmpty () {
    return this.messageList.length == 0;
  }

  isWSMessageListEmpty () {
    return this.wsMessageList.length == 0;
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

    if (!this.isWSMessageListEmpty ()) {
      let message = this.wsMessageList[0];
      if (message) {
        this.emit (message.cmd, message);
        delete this.wsMessageList[0];
        this.wsMessageList.splice (0, 1);
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
            // console.info ('移除:' + uuidcommand);
          }
          removeUUID = uuidcommand;
        });
      }
    } catch (ex) {
      // console.info ('uuidcommand:' + removeUUID);
    }

    let count = this.commandMap.size;
    if (count > 0) {
      this.commandMap.forEach (command => {
        this.sendCommand (command);
      });
    }

    if (this.removeUUIDList.length > 0) {
      this.removeUUIDList = [];
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
      // console.info ('topic:' + topic);
      // console.info ('packet message:' + message);
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
    // console.info (
    //   'cmd:' +
    //     cmd +
    //     ' salt:' +
    //     salt +
    //     ' timestamp:' +
    //     timestamp +
    //     ' key:' +
    //     key +
    //     ' token:' +
    //     token,
    //   ' filter:' + filter
    // );
    let messageIndex = 0;
    let num_id = timestampToTime (timestamp) + message_num;
    num_id = num_id.substring (0, 20);
    return encode (cmd, num_id, timestamp, src, user, 200, token, filter, []);
  }

  reset () {
    //this.commandList = [];
    this.commandMap.clear ();
    this.wsCommandMap.clear ();
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
  }

  removeCommand({uuid, cmd}) {
    this.removeUUIDList.push (uuid + '-' + cmd);
  }

  addWsCommand (command) {
    if (command && command.uuid != null && command.uuid.length > 0) {
      this.wsCommandMap.set (command.uuid + '-' + command.cmd, command);
    }
  }

  removeWsCommand({uuid, cmd}) {
    this.removeWsUUIDList.push (uuid + '-' + cmd);
  }
}

export default new MessageManager ();
