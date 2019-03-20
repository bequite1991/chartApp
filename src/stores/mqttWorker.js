import {observable, computed, toJS, autorun} from 'mobx';

import EventEmitter from 'events';

import messageManager from './messageManager';

let clientInstance = null;

const CHANNEL_INIT = 'session:init';
const CHANNEL_CONNECT = 'session:connect'; // subscribe
const CHANNEL_SUBSCRIBE = 'session:subscribe';
const CHANNEL_UNSUBSCRIBE = 'session:unsubscribe';
const CHANNEL_PUBLISH = 'session:publish';
const CHANNEL_CMD = 'session:data';
const CHANNEL_EXIT = 'session:exit';

class MqttWorker extends EventEmitter {
  messageList = []; // 消息列表
  toClose = false;
  hasSubscribe = [];
  client = null;

  constructor () {
    super ();

    this.client = null;

    if (clientInstance) {
      return clientInstance;
    }

    this.on (CHANNEL_INIT, list => {
      console.info (list);
      this.hasSubscribe = list;
      this.toClose = true;
    });

    this.on (CHANNEL_CONNECT, options => {
      console.info (options);
      this.connect (options);
    });

    this.on (CHANNEL_PUBLISH, options => {
      //debugger;
      this.publish (options.topic, options.message, 1, false);
    });

    clientInstance = this;
  }

  /**
   * 新增订阅,将订阅和消息命令绑定在一起
   * @param {*} subscribe 
   * @param {*} cmd 
   */
  addSubscribe (subscribe, cmd) {
    this.hasSubscribe.push (subscribe);
  }

  init () {
    this.toClose = false;
  }

  /**
   * 连接服务器
   */
  connect (options) {
    if (this.toClose == false) {
      return;
    }

    this.toClose = false;

    //连接服务器
    var setConnect = function () {};
    var setMessage = function () {};
    let i = 0;

    this.client = new Paho.MQTT.Client (
      options.ip,
      options.port,
      options.clientName
    );

    const connectOpt = {
      userName: options.userName,
      password: options.passWord,
      cleanSession: options.cleanSession,
      timeout: options.timeout,
      keepAliveInterval: options.keepAliveInterval,
      onSuccess: () => {
        setConnect (true);
        this.initSubscribe ();
        console.log ('mqtt connect success');
        //this.setState ({connectStatus: 100});
      },
      onFailure: () =>
        (setConnect (false), console.log ('mqtt connect failure')),
    };

    this.client.onConnectionLost = () => {
      debugger;
      setConnect (true);
      clientInstance.client.connect (connectOpt);
      console.log ('mqtt reConnect ...');
    };

    this.client.onMessageArrived = message => {
      message._index = ++i;
      debugger;
      setMessage (message);
      console.log (message);
    };

    this.client.connect (connectOpt);

    console.log ('mqtt connect ...');

    //this.toClose = false;
    // this.setState ({
    //   client,
    // });
  }

  initSubscribe () {
    if (this.toClose) {
      return;
    }
    if (!clientInstance.client.isConnected ()) {
      return;
    }
    for (let i = 0, l = clientInstance.hasSubscribe.length; i < l; i++) {
      console.log ('即将订阅的主题：' + clientInstance.hasSubscribe[i]);
      clientInstance.hasSubscribe[i] &&
        clientInstance.client.subscribe (clientInstance.hasSubscribe[i], {
          onSuccess: function (res) {
            console.log ('subscribe success' + res);
          },
        });
    }
  }

  /**
   * 订阅
   * @param {*} filter
   */
  subscribe (filter) {
    if (this.toClose) {
      return;
    }

    if (!filter) {
      return;
    }

    clientInstance.client.isConnected () &&
      clientInstance.client.subscribe (filter);
    hasSubscribe.push (filter);
    console.log ('mqtt subscribe', filter);
  }

  /**
   * 发送消息
   * @param {*} topic
   * @param {*} message
   * @param {*} qos
   * @param {*} retained
   */
  publish (topic, message, qos, retained) {
    if (this.toClose) {
      return;
    }
    //发送消息
    //mqtt数据相关
    var msgObj = new Paho.MQTT.Message (message);
    msgObj.destinationName = topic;
    if (qos) {
      msgObj.qos = qos;
    }
    if (retained) {
      msgObj.retained = retained;
    }
    console.log (msgObj.payloadString);
    clientInstance.client.send (msgObj);
  }

  /**
   * 取消订阅
   * @param {*} filter
   */
  unSubscribe (filter) {
    if (this.toClose) {
      return;
    }
    //取消订阅
    clientInstance.client.isConnected () &&
      clientInstance.client.unsubscribe (filter);
    for (let i = 0, l = hasSubscribe.length; i < l; i++) {
      if (filter == hasSubscribe[i]) {
        hasSubscribe.splice (i, 1);
      }
    }
    console.log ('mqtt unsubscribe', filter);
  }

  closeConnect () {
    if (this.toClose == true) {
      return;
    }
    this.toClose = true;
    clientInstance.client.disconnect ();
  }
}

clientInstance = new MqttWorker ();

export default clientInstance;
