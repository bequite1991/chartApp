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

let Base64 = require('js-base64').Base64;

import {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Offline_Count_Every_Month_Chart_Option,
  Elevator_Map_China_Options,
  Elevator_Error_Every_Month_Chart_Options,
  Elevator_Error_Ratio_Chart_Options,
  Elevator_Maintenance_OrdersAndFinish_Chart_Options,
  Elevator_maintenance_Orders_Month_Chart_Options,
  Map_Info_Value,
} from '../datacenter/chartConfig';

import eventProxy from '../lib/eventProxy';

class WarningManager extends EventEmitter {
  wsCommandMap = new Map();
  removeWsUUIDList = [];

  commandMap = new Map();
  commandImmediatelyMap = new Map();
  commandUUIDList = [];

  serverOptionsValue = SERVER_OPTIONS;

  sendCount = 0;

  messageList = [];
  wsMessageList = [];

  removeUUIDList = [];

  curFiter = '';

  constructor() {
    super();

    this.on('register', args => {
      // console.info ('注册消息:' + args.cmd + ' uuid:' + args.uuid);
      if (args.uuid && args.uuid.length > 0) {
        if (args.filter.length == 0) {
          debugger;
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
      this.removeCommand(args);
    });

    this.on('ws-register', args => {
      //debugger;
      if (websocketWorker && websocketWorker.isWSConnected() == false) {
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

    this.messageEmitterTimer = setInterval(() => {
      this.messageEmitter();
    }, 5000);

    this.parserLoopTimer = setInterval(() => {
      this.parserLoop();
    }, 2000);

    this.wsMessageEmitterTimer = setInterval(() => {
      this.wsMessageEmitter();
    }, 5000);

    this.on('9001', args => {
      //debugger;
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let filter = args.filter;
          if (filter != null && filter.length > 0) {
            let item = rows[0];
            if (item) {
              let url = item.url;
              if (url && url.length > 0) {
                console.log('url:' + url);
                let options = { url: url };
                debugger;
                //this.elevatorConnectOption = options;
                //this.elevatorConnectOption = options;
                eventProxy.trigger('msg-9001-' + args.filter, {
                  elevatorConnectOption: options,
                });
              }
            } else if (dev_id_list && dev_id_list.length > 0) {
              let installRecordInformationArray = [];
              let maintenanceInformationArray = [];

              rows.forEach(item => {
                let use_corp_name = item.use_corp_name;
                let dev_cname = item.dev_cname;
                let createdate = item.createdate;
                let mai_period = item.mai_period;
                let mai_curdate = item.mai_curdate ? item.mai_curdate : ' ';
                let mai_curoper = item.mai_curoper ? item.mai_curoper : ' ';
                let message =
                  '电梯名称:' +
                  dev_cname +
                  '，使用单位:' +
                  use_corp_name +
                  '，安装时间:' +
                  createdate;
                let message2 =
                  '电梯名称:' +
                  dev_cname +
                  '，使用单位:' +
                  use_corp_name +
                  '，维保周期:' +
                  mai_period +
                  '，当前维保时间:' +
                  mai_curdate +
                  '，当前维保人:' +
                  mai_curoper;
                installRecordInformationArray.push(message);
                maintenanceInformationArray.push(message2);
              });

              if (installRecordInformationArray && installRecordInformationArray.length > 0) {
                //this.installRecordInformation = installRecordInformationArray;
              }

              if (maintenanceInformationArray && maintenanceInformationArray.length > 0) {
                //this.maintenanceInformation = maintenanceInformationArray;
              }
            }
          }
        }
      }
    });

    this.on('9002', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let filter = args.filter;
          if (filter != null && filter.length > 0) {
            if (rows && rows.length > 0) {
              let dataArray = [];
              let dev_name = '';
              rows.forEach(item => {
                let ondate = item.ondate;
                let offdate = item.offdate;
                let time_length = '';

                if (dev_name.length == 0) {
                  dev_name = item.dev_cname;
                }

                let message =
                  '上线时间:' + ondate + ' 下线时间:' + offdate + ' 时长:' + time_length;
                //debugger;
                dataArray.push(message);
              });

              // if (dataArray.length > 0) {
              //   this.elevatorLog = dataArray;
              // }

              // if (dev_name.length > 0) {
              //   this.elevatorDevInfo = { name: dev_name };
              // }
              eventProxy.trigger('msg-9002-' + args.filter, {
                elevatorLog: dataArray,
              });

              eventProxy.trigger('msg-9006-' + args.filter, {
                elevatorDevInfo: { name: dev_name },
              });
            }
          }
        }
      }
    });

    this.on('9004', args => {});

    this.on('9006', args => {
      //debugger;
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let row = rows[0];
          let totalInfo = {
            total: row.total ? row.total : '0',
            onLineTotal: row.on_total ? row.on_total : '0',
          };

          eventProxy.trigger('msg-9006-' + args.filter, { totalInfo: totalInfo });

          //this.totalInfo = totalInfo;
          //console.info('9006 is get data');
        }
      }
    });

    this.on('9007', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        let elevatorErrorEveryMonthOption = Elevator_Error_Every_Month_Chart_Options;
        if (rows && rows.length > 0) {
          let dataArray = [];
          let categoryArray = [];
          let pieDataArray = [];

          rows.forEach(item => {
            //
            let title = item.alertname;
            let total = item.alarm_num;
            categoryArray.push(title);
            dataArray.push(total);

            pieDataArray.push({ value: total, name: title });
          });

          elevatorErrorEveryMonthOption.xAxis[0].data = categoryArray;

          elevatorErrorEveryMonthOption.series = [
            {
              name: '离线数量',
              type: 'bar',
              barWidth: '20%',
              data: dataArray,
              itemStyle: { normal: { color: '#2dd8db' } },
            },
          ];

          // this.elevatorErrorRatioOptionValue.legend.data = categoryArray;
          elevatorErrorEveryMonthOption.series[0].data = pieDataArray;
          if (pieDataArray.length > 0) {
            eventProxy.trigger('msg-9007-' + args.filter, {
              elevatorErrorEveryMonthOption: elevatorErrorEveryMonthOption,
            });
          }
        }
      }
    });

    this.on('9011', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let rowsArray = [];
          rows.forEach(item => {
            //debugger;
            let dev_id = item.id ? item.id : '';
            let mai_oper_name = item.mai_oper_name ? item.mai_oper_name : '';
            let mai_time = item.mai_time ? item.mai_time : '';
            let mai_etime = item.mai_etime ? item.mai_etime : '';
            let mai_content = item.mai_content ? item.mai_content : '';
            let content = '未知';
            switch (mai_content) {
              case '0':
                content = '半月维保';
                break;
              case '1':
                content = '季度维保';
                break;
              case '2':
                content = '半年维保';
                break;
              case '3':
                content = '年度维保';
                break;
              default:
                content = '未知';
                break;
            }

            rowsArray.push(
              dev_id + ' ' + mai_oper_name + ' ' + mai_time + '' + mai_etime + ' ' + content
            );
          });

          if (rowsArray.length > 0) {
            //this.maintenanceRecordData = rowsArray;
            eventProxy.trigger('msg-9011-' + args.filter, {
              maintenanceRecordData: rowsArray,
            });
          }
        }
      }
    });

    this.on('9012', args => {
      //debugger;
      if (args && args.resp == '200') {
        let runningDataOptionValue = Elevator_Running_Data_Chart_Options;
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let dataArray = [];
          rows.forEach(item => {
            let data = item.total;
            dataArray.push(data);
          });
          runningDataOptionValue.xAxis[0].data = ['总运行天数（天）'];
          runningDataOptionValue.series[0].data = dataArray;
          eventProxy.trigger('msg-9012-' + args.filter, {
            runningDataOption: runningDataOptionValue,
          });
        }
      }
    });

    this.on('open_iframe', args => {
      debugger;
      eventProxy.trigger('msg-open-iframe-' + args.devId, {
        elevatorInTimeIFrameOption: { url: args.url, open: args.open },
      });
      //this.elevatorInTimeIFrameOption = { url: args.url, open: args.open };
    });
  }

  addMessage(message) {
    if (message) {
      this.messageList.push(message);
    }
  }

  addWSMessage(message) {
    debugger;
    if (message) {
      const dev_id = QueryString.parse(window.location.search).dev_id || '';
      // if (dev_id) {
      //   debugger;
      //   if (dev_id.length == 0 || dev_id == message.filter) {
      //     this.wsMessageList.push(message);
      //   }
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
        //debugger;
        this.emit(message.cmd, message);
        delete this.messageList[0];
        this.messageList.splice(0, 1);
      }
    }

    if (!this.isWSMessageListEmpty()) {
      let message = this.wsMessageList[0];
      if (message) {
        debugger;
        //this.emit(message.cmd, message);
        delete this.wsMessageList[0];
        this.wsMessageList.splice(0, 1);
      }
    }
  }

  wsMessageEmitter() {
    if (!websocketWorker || websocketWorker.isWSConnected() == false) {
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
    if (count > 0) {
      this.wsCommandMap.forEach(command => {
        this.sendWsCommand(command);
      });

      this.wsCommandMap.clear();
    }

    if (this.removeWsUUIDList.length) {
      this.removeWsUUIDList = [];
    }
  }

  messageEmitter() {
    // 移除列表数据
    let index = 0;
    let removeUUID = '';
    try {
      if (this.removeUUIDList.length > 0) {
        //debugger;
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
      }
    } catch (ex) {
      // console.info ('uuidcommand:' + removeUUID);
    }

    let count = this.commandMap.size;
    if (count > 0) {
      //debugger;
      if (this.sendCount <= count) {
        let key = this.commandUUIDList.shift();
        let command = this.commandMap.get(key);
        if (command) {
          this.sendCommand(command);
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

    if (this.commandImmediatelyMap.size > 0) {
      debugger;
      this.commandImmediatelyMap.forEach(command => {
        this.sendCommand(command);
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
    let messageIndex = 0;
    let num_id = timestampToTime(timestamp) + message_num;
    num_id = num_id.substring(0, 20);
    return encode(cmd, num_id, timestamp, src, user, 200, token, filter, rows);
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

  sendWsCommand(command) {
    debugger;
    if (command && websocketWorker) {
      websocketWorker.emit('ws-send', {
        cmd: command.cmd,
        dev_id: command.dev_id,
      });
    }
  }

  addWsCommand(command) {
    if (command && command.uuid != null && command.uuid.length > 0) {
      this.wsCommandMap.set(command.uuid + '-' + command.cmd, command);
    }
  }

  removeWsCommand({ uuid, cmd }) {
    this.removeWsUUIDList.push(uuid + '-' + cmd);
  }

  setCurrFiter(fiter) {
    this.curFiter = fiter;
  }

  getCurrFiter() {
    return this.curFiter;
  }
}

export default new WarningManager();
