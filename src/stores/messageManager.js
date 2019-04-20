import { observable, computed, toJS, autorun } from 'mobx';

import EventEmitter from 'events';

import mqttWorker from './mqttWorker';

import websocketWorker from './websocketWorker';

import mqttMessage from './mqttMessage';

import { PROTOCAL_REQUEST, PROTOCAL_RESPONSE } from '../datacenter/protocol';

import { SERVER_OPTIONS } from '../datacenter/serverConfig';

import md5 from 'js-md5';

import { encode, timestampToTime } from '../lib/helper.js';

import QueryString from 'query-string';

import warningManager from './warningManager';

let Base64 = require('js-base64').Base64;

class MessageManager extends EventEmitter {
  wsCommandMap = new Map();

  commandMap = new Map();

  commandImmediatelyMap = new Map();

  commandUUIDList = [];

  subscribe = [];
  removeWsUUIDList = [];
  removeUUIDList = [];
  wsMessageEmitterTimer = null;
  messageEmitterTimer = null;
  parserLoopTimer = null;

  serverOptionsValue = SERVER_OPTIONS;
  timestamp = new Date().getTime();

  messageList = [];

  wsMessageList = [];

  isdetail = false;

  dev_id = '';

  isWSInit = false;

  isWSOpen = false;

  sendCount = 0;

  constructor() {
    super();

    this.dev_id = QueryString.parse(window.location.search).dev_id || '';

    let options = this.serverOptionsValue;
    options.clientName = options.clientName + '-' + new Date().toLocaleTimeString();

    let protocal_value = Object.values(PROTOCAL_RESPONSE);
    protocal_value.forEach(item => {
      this.subscribe.push(item + '/' + options.userName);
    });

    mqttWorker.emit('session:init', this.subscribe);
    mqttWorker.emit('session:connect', options);

    this.on('register', args => {
      // console.info ('注册消息:' + args.cmd + ' uuid:' + args.uuid);

      if (args.uuid && args.uuid.length > 0) {
        if (args.filter.length == 0) {
          //debugger;
        }

        this.addCommand({
          uuid: args.uuid ? args.uuid : '',
          cmd: args.cmd,
          filter: args.filter ? args.filter : '',
        });
      }
    });

    this.on('unregister', args => {
      // console.info ('取消注册消息:' + args.cmd);
      if (args.cmd == '9005') {
        debugger;
      }
      this.removeCommand(args);
    });

    this.on('send', args => {
      debugger;
      let rows = [];
      rows.push({
        sn: args.id + '',
        status: '1',
      });

      let message = {
        cmd: args.cmd,
        filter: args.filter,
        rows: rows,
      };
      this.addImmediatelyCommand(message);
    });

    this.on('ws-register', args => {
      if (this.isWSInit == false && websocketWorker) {
        this.isWSInit = true;
        let key =
          'eyJpZCI6InllIiwia2V5IjoiNDZDQzQ1QTcyN0JFQzdERTk3RjlFNzM4QUQ0MjgxNTMiLCJwcm9qZWN0Q29kZSI6Imh1aWJhbyIsInRpbWVzdGFtcCI6IjIwMTcxMTA2MTgxNDA2In0=';
        let url = 'ws://www.dtimao.com:8088/dtimao/webSocket/';
        websocketWorker.emit('ws-connect', { url: url, key: key });
      }

      // console.info ('ws注册消息:' + args.cmd + ' uuid:' + args.uuid);
      if (args.uuid && args.uuid.length > 0) {
        this.addWsCommand({
          uuid: args.uuid ? args.uuid : '',
          cmd: args.cmd,
          dev_id: args.filter ? args.filter : '',
        });
      }
    });

    this.on('ws-unregister', args => {
      //debugger;
      // console.info ('取消注册消息:' + args.cmd);
      this.removeWsCommand(args);
    });

    this.on('ws-open', args => {
      this.isWSOpen = args.isOpen ? args.isOpen : false;
    });

    this.messageEmitterTimer = setInterval(() => {
      this.messageEmitter();
    }, 1000);

    this.parserLoopTimer = setInterval(() => {
      this.parserLoop();
    }, 1000);

    this.wsMessageEmitterTimer = setInterval(() => {
      this.wsMessageEmitter();
    }, 1000);
  }

  wsMessageEmitter() {
    if (!websocketWorker || this.isWSInit == false) {
      return;
    }
    // 移除列表数据
    let index = 0;
    let removeUUID = '';
    try {
      if (this.removeWsUUIDList.length > 0) {
        this.removeWsUUIDList.forEach(uuidcommand => {
          let command = this.wsCommandMap.get(uuidcommand);
          if (command) {
            this.wsCommandMap.delete(uuidcommand);
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
      this.wsCommandMap.forEach(command => {
        this.sendWsCommand(command);
      });

      this.wsCommandMap.clear();
    }

    if (this.removeWsUUIDList.length) {
      this.removeWsUUIDList = [];
    }
  }

  sendWsCommand(command) {
    if (command && websocketWorker) {
      websocketWorker.emit('ws-send', {
        cmd: command.cmd,
        dev_id: command.dev_id,
      });
    }
  }

  addMessage(message) {
    if (message) {
      const dev_id = QueryString.parse(window.location.search).dev_id || '';
      if (dev_id.length > 0) {
        //debugger;
        if (dev_id == message.filter) {
          this.messageList.push(message);
        } else {
          if (warningManager) {
            warningManager.addMessage(message);
          }
        }
      } else {
        if (dev_id.length == 0) {
          if (message.filter.length == 0) {
            this.messageList.push(message);
          } else {
            const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';
            if (dev_id_list.length == 0) {
              if (message.filter.length == 0) {
                this.messageList.push(message);
              } else {
                if (warningManager) {
                  warningManager.addMessage(message);
                }
              }
            } else {
              if (dev_id_list != message.filter && message.filter.length > 0) {
                if (warningManager) {
                  warningManager.addMessage(message);
                }
              } else {
                this.messageList.push(message);
              }
            }
          }
        } else {
          if (dev_id.length > 0 && dev_id != message.filter && message.filter.length > 0) {
            if (warningManager) {
              warningManager.addMessage(message);
            }
          }
        }
      }
    }
  }

  addWSMessage(message) {
    //debugger;
    if (message) {
      const dev_id = QueryString.parse(window.location.search).dev_id || '';
      // if (dev_id) {
      //   debugger;
      //   if (dev_id.length == 0 || dev_id == message.filter) {
      //     this.wsMessageList.push(message);
      //   }
      // }

      // if (warningManager) {
      //   warningManager.addWSMessage(message);
      // }
      this.wsMessageList.push(message);
    }
  }

  isMessageListEmpty() {
    return this.messageList.length == 0;
  }

  isWSMessageListEmpty() {
    return this.wsMessageList.length == 0;
  }

  parserLoop() {
    if (!this.isMessageListEmpty()) {
      let message = this.messageList[0];
      if (message) {
        this.emit(message.cmd, message);
        delete this.messageList[0];
        this.messageList.splice(0, 1);
      }
    }

    if (!this.isWSMessageListEmpty()) {
      let message = this.wsMessageList[0];
      if (message) {
        this.emit(message.cmd, message);
        delete this.wsMessageList[0];
        this.wsMessageList.splice(0, 1);
      }
    }
  }

  messageEmitter() {
    // 移除列表数据
    let index = 0;
    let removeUUID = '';

    const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';
    const dev_id = QueryString.parse(window.location.search).dev_id || '';
    let hasFiter = dev_id_list.length > 0;
    if (hasFiter == false) {
      hasFiter = dev_id.length > 0;
    }

    try {
      if (this.removeUUIDList.length > 0) {
        //debugger;
        let beforeCount = this.commandMap.size;
        let afterCount = 0;
        this.removeUUIDList.forEach(uuidcommand => {
          let command = this.commandMap.get(uuidcommand);
          if (command) {
            this.commandMap.delete(uuidcommand);
            console.info('移除:' + uuidcommand);
          }
          removeUUID = uuidcommand;
        });

        this.sendCount = 0;
        this.commandUUIDList = [];
        this.commandMap.forEach(command => {
          this.commandUUIDList.push(command.uuid + '-' + command.cmd);
        });

        afterCount = this.commandMap.size;

        console.info('删除消息: 之前:' + beforeCount + ' 之后:' + afterCount);
      }
    } catch (ex) {
      // console.info ('uuidcommand:' + removeUUID);
    }

    let count = this.commandMap.size;
    if (count > 0) {
      //   //debugger;
      if (this.sendCount <= count) {
        let key = this.commandUUIDList.shift();
        let command = this.commandMap.get(key);
        if (command) {
          let canSend = hasFiter == command.filter.length > 0;
          if (canSend) {
            this.sendCommand(command);
          }
        }
        ++this.sendCount;
        if (this.sendCount > count) {
          //debugger;
          this.sendCount = 0;

          this.commandUUIDList = [];
          this.commandMap.forEach(command => {
            this.commandUUIDList.push(command.uuid + '-' + command.cmd);
          });
        }
      }
    }

    // this.commandMap.forEach(command => {
    //   if (command) {
    //     let canSend = hasFiter == command.filter.length > 0;
    //     if (canSend) {
    //       this.sendCommand(command);
    //     }
    //   }
    // });

    if (this.commandImmediatelyMap.size > 0) {
      //debugger;

      this.commandImmediatelyMap.forEach(command => {
        if (command) {
          let canSend = hasFiter == command.filter.length > 0;
          if (canSend) {
            this.sendCommand(command);
          }
        }
      });
      this.commandImmediatelyMap.clear();
    }

    if (this.removeUUIDList.length > 0) {
      this.removeUUIDList = [];
    }
  }

  sendCommand(command) {
    //debugger;
    let cmd = command.cmd;
    let filter = command.filter ? command.filter : '';
    let rows = command.rows ? command.rows : [];
    if (this.hasTopic(cmd)) {
      let topic = PROTOCAL_REQUEST[cmd] + '/' + this.serverOptionsValue.userName;
      let src_topic = PROTOCAL_RESPONSE[cmd].replace(new RegExp('/', 'gm'), '.'); //PROTOCAL_REQUEST[cmd].split ('/')[3];

      src_topic = src_topic + '.' + this.serverOptionsValue.userName;
      let username = this.serverOptionsValue.userName;
      let message_num = '0001';
      let message = this.packetMessage(
        cmd,
        src_topic,
        username,
        this.serverOptionsValue.passWord,
        new Date().getTime(),
        message_num,
        filter,
        rows
      );
      // console.info ('topic:' + topic);
      console.info('packet message:' + message);
      mqttWorker.emit('session:publish', { topic: topic, message: message });
    }
  }

  hasTopic(cmd) {
    return PROTOCAL_REQUEST[cmd];
  }

  packetMessage(cmd, src, user, salt, timestamp, message_num, filter, rows) {
    let key = '7D13B47CEA2DC5828D6910D3C0FA31DD'; //md5 (salt).toUpperCase ();
    let token = Base64.encode(JSON.stringify({ cmd: cmd, key: key, timestamp: timestamp }));
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
    let num_id = timestampToTime(timestamp) + message_num;
    num_id = num_id.substring(0, 20);
    return encode(cmd, num_id, timestamp, src, user, 200, token, filter, rows);
  }

  reset() {
    //this.commandList = [];
    this.commandMap.clear();
    this.wsCommandMap.clear();
    this.subscribe = [];
    this.messageList = [];
  }

  // isCommandEmpty () {
  //   return this.commandList.length == 0;
  // }

  hasCommand(cmd) {
    let index = -1;
    let id = -1;
    let commandList = Object.values(this.commandMap);
    commandList.forEach(item => {
      ++index;
      if (item.cmd == cmd) {
        id = index;
        return;
      }
    });

    return id;
  }

  addCommand(command) {
    if (command && command.uuid != null && command.uuid.length > 0) {
      this.commandMap.set(command.uuid + '-' + command.cmd, command);
      this.commandUUIDList.push(command.uuid + '-' + command.cmd);
    }
  }

  addImmediatelyCommand(command) {
    this.commandImmediatelyMap.set(command.uuid + '-' + command.cmd, command);
  }

  removeCommand({ uuid, cmd }) {
    this.removeUUIDList.push(uuid + '-' + cmd);
    console.info('添加移除:' + uuid + '-' + cmd);
  }

  addWsCommand(command) {
    if (command && command.uuid != null && command.uuid.length > 0) {
      this.wsCommandMap.set(command.uuid + '-' + command.cmd, command);
    }
  }

  removeWsCommand({ uuid, cmd }) {
    this.removeWsUUIDList.push(uuid + '-' + cmd);
  }
}

export default new MessageManager();
