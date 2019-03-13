import EventEmitter from 'events';

let clientInstance = null;

const CHANNEL_INIT = 'session:init';
const CHANNEL_CONNECT = 'session:connect'; // subscribe
const CHANNEL_SUBSCRIBE = 'session:subscribe';
const CHANNEL_UNSUBSCRIBE = 'session:unsubscribe';
const CHANNEL_PUBLISH = 'session:publish';
const CHANNEL_CMD = 'session:data';
const CHANNEL_EXIT = 'session:exit';

class MqttWorker extends EventEmitter {
  toClose = false;
  hasSubscribe = [];

  constructor () {
    super ();
    let _this = this;
    this.state = {};

    if (clientInstance) {
      return clientInstance;
    }

    _this.on (CHANNEL_INIT, list => {
      console.info (list);
      debugger;
      _this.hasSubscribe = list;
      _this.toClose = true;
    });

    _this.on (CHANNEL_CONNECT, options => {
      console.info (options);
      debugger;
      this.connect (options);
    });

    clientInstance = _this;
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
    //连接服务器
    var setConnect = function () {};
    var setMessage = function () {};
    let i = 0;

    debugger;

    const client = new Paho.MQTT.Client (
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
        this.setState ({connectStatus: 100});
      },
      onFailure: () =>
        (setConnect (false), console.log ('mqtt connect failure')),
    };

    client.onConnectionLost = () => {
      setConnect (true);
      client.connect (connectOpt);
      console.log ('mqtt reConnect ...');
    };

    client.onMessageArrived = message => {
      message._index = ++i;
      setMessage (message);
      console.log (message);
    };

    client.connect (connectOpt);

    console.log ('mqtt connect ...');

    // this.setState ({
    //   client,
    // });
  }

  initSubscribe () {
    if (this.toClose) {
      return;
    }
    const {client, hasSubscribe} = this.state;
    if (!client.isConnected ()) {
      return;
    }
    for (let i = 0, l = hasSubscribe.length; i < l; i++) {
      console.log ('即将订阅的主题：' + hasSubscribe[i]);
      hasSubscribe[i] &&
        client.subscribe (hasSubscribe[i], {
          onSuccess: function (res) {
            debugger;
            console.log ('subscribe success');
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
    const {client, hasSubscribe} = this.state;

    client.isConnected () && client.subscribe (filter);
    hasSubscribe.push (filter);
    // this.setState ({
    //   subscribe: filter,
    //   hasSubscribe,
    // });
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
    const {client} = this.state;

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
    client.send (msgObj);
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
    const {client, hasSubscribe} = this.state;
    client.isConnected () && client.unsubscribe (filter);
    for (let i = 0, l = hasSubscribe.length; i < l; i++) {
      if (filter == hasSubscribe[i]) {
        hasSubscribe.splice (i, 1);
      }
    }
    this.setState ({
      unSubscribe: filter,
      hasSubscribe,
    });
    console.log ('mqtt unsubscribe', filter);
  }

  closeConnect () {
    if (this.toClose == true) {
      return;
    }
    const {client} = this.state;
    this.toClose = true;
    client.disconnect ();
  }
}

clientInstance = new MqttWorker ();

export default clientInstance;
