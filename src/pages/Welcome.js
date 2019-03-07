// export default () => (
//   <p style={{ textAlign: 'center' }}>
//     想要添加更多页面？请参考{' '}
//     <a href="https://umijs.org/guide/block.html" target="_blank" rel="noopener noreferrer">
//       umi 区块
//     </a>
//     。
//   </p>
// );

import React, {PureComponent} from 'react';
require ('../services/utils/mqttws31');

export default class TodaySpec extends PureComponent {
  client = null;

  defaultServer = '121.43.165.110'; //'222.73.204.54';
  defaultPort = 3991; //9001;
  defaultSubTopic = '#';
  defaultPubTopic = 'alert';
  defaultPubMessage = '';

  server = ''; //getUrlVars ()['ip'] == null ? defaultServer : getUrlVars ()['ip'];
  port = 9001;
  subTopics = [];
  moreTopics = true;
  baseUrlVar = 'subTopic';
  urlVar = '';
  count = 1;
  hasSubTopics = false;

  username = '15051841028';
  password = 'huibao1841028';

  componentDidMount () {
    const t = this;
    //this.getInfo ();
    this.client = null;
    this.username = '';
    this.password = '';

    this.clientId = 'MQTTHelper-' + Math.floor (10000 + Math.random () * 90000);

    this.server = this.defaultServer;
    this.port = this.defaultPort;
  }

  connect () {
    const t = this;
    debugger;
    try {
      t.client = new Paho.MQTT.Client (
        t.server,
        parseFloat (t.port),
        t.clientId
      );
    } catch (error) {
      alert ('Error:' + error);
    }

    t.client.onMessageArrived = function (msg) {
      var topic = msg.destinationName;
      var payload = msg.payloadString;
      var qos = msg._getQos ();
      var retained = msg._getRetained ();

      var qosStr = qos > 0 ? '[qos ' + qos + ']' : '';
      var retainedStr = retained ? '[retained]' : '';
      console.info (
        "<span class='logRCV'>RCV [<span class='logTopic'>" +
          topic +
          '</span>]' +
          qosStr +
          retainedStr +
          " <span class='logPayload'>" +
          payload +
          '</span></span>'
      );
    };

    t.client.onConnectionLost = function () {};

    var connectOptions = new Object ();
    connectOptions.useSSL = false;
    connectOptions.cleanSession = true;
    if (t.username) {
      connectOptions.userName = t.username;
    }
    if (t.password) {
      connectOptions.password = t.password;
    }
    if (t.noCleanSession) {
      connectOptions.cleanSession = false;
    }
    if (t.useSSL) {
      connectOptions.useSSL = true;
    }
    if (t.willMessage) {
      connectOptions.willMessage = willMessage;
    }

    connectOptions.keepAliveInterval = 3600; // if no activity after one hour, disconnect
    connectOptions.timeout = 5;

    connectOptions.onSuccess = function () {
      console.info ('Connected to ' + this.server + ':' + this.port);
      if (this.autoSubscribe) {
        var time = 500;
        for (var i in this.subTopics) {
          setTimeout (
            (function (topic) {
              return function () {};
            }) (this.subTopics[i]),
            time
          );
          time += 100;
        }
      }
      if (this.autoPublish) {
        setTimeout (function () {}, 500);
      }
    };

    connectOptions.onFailure = function (error) {
      console.info (
        'Failed to connect to ' +
          this.server +
          ':' +
          this.port +
          '.  Code: ' +
          error.errorCode +
          ', Message: ' +
          error.errorMessage
      );
    };

    connectOptions.onSuccess.bind (this);
    connectOptions.onFailure.bind (this);

    t.client.connect (connectOptions);
  }

  getUrlVars () {
    var vars = {};
    var parts = window.location.href.replace (
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  }

  onMessage (msg) {
    var topic = msg.destinationName;
    var payload = msg.payloadString;
    var qos = msg._getQos ();
    var retained = msg._getRetained ();

    var qosStr = qos > 0 ? '[qos ' + qos + ']' : '';
    var retainedStr = retained ? '[retained]' : '';
    console.info (
      "<span class='logRCV'>RCV [<span class='logTopic'>" +
        topic +
        '</span>]' +
        qosStr +
        retainedStr +
        " <span class='logPayload'>" +
        payload +
        '</span></span>'
    );
  }

  unsubscribe (topic) {
    const t = this;
    t.client.unsubscribe (topic, {
      onSuccess: function () {
        //subsList[topic] = null;
        //var elem = document.getElementById (topic);
        //elem.parentNode.removeChild (elem);
        console.info (
          "Unsubscribed from [<span class='logTopic'>" + topic + '</span>]'
        );
      },
      onFailure: function () {
        console.info (
          "Unsubscribe failed: [<span class='logTopic'>" + topic + '</span>]'
        );
      },
    });
  }

  publish (topic, message, qos, retained) {
    const t = this;
    var msgObj = new Paho.MQTT.Message (message);
    msgObj.destinationName = topic;
    if (qos) {
      msgObj.qos = qos;
    }
    if (retained) {
      msgObj.retained = retained;
    }
    t.client.send (msgObj);

    var qosStr = qos > 0 ? '[qos ' + qos + ']' : '';
    var retainedStr = retained ? '[retained]' : '';
    console.info (
      "<span class='logPUB'>PUB [<span class='logTopic'>" +
        topic +
        '</topic>]' +
        qosStr +
        retainedStr +
        " <span class='logPayload'>" +
        message +
        '</span></span>'
    );
  }

  onConnectionLost (error) {
    const t = this;
    console.log (error);
    console.info (
      'Disconnected from ' +
        t.server +
        ':' +
        t.port +
        '.  Code: ' +
        error.errorCode +
        ', Message: ' +
        error.errorMessage
    );
    subsList = {};
  }

  closeConnect () {
    this.client.disconnect ();
  }

  subscribe (topic, qos) {
    this.client.subscribe (topic, {
      qos: qos,
      onSuccess: function () {
        console.info (
          "Subscribed to [<span class='logTopic'>" +
            topic +
            '</span>][qos ' +
            qos +
            ']'
        );
        if (!this.subsList[topic]) {
          this.subsList[topic] = true;
        }
      },
      onFailure: function () {
        console.info ('Subscription failed: [' + topic + '][qos ' + qos + ']');
      },
    });
  }

  getInfo () {
    // var Paho = require("paho-mqtt/paho-mqtt.js");
    // var client  = mqtt.connect('mqtt://127.0.0.1:1883');

    // client.on('connect', function () {
    //   client.subscribe('/inshn_dtimao/huibao/dev_info/user')
    //   client.publish('/inshn_dtimao/huibao/dev_info/user');
    // })

    // client.on('message', function (topic, message) {
    //   // message is Buffer
    //   console.log(message.toString())
    //   client.end()
    // })

    // var client  = mqtt.connect('mqtt://127.0.0.1:1883');

    // client.on('connect', function () {
    // 	debugger
    //   client.subscribe('presence')
    //   client.publish('presence', 'Hello mqtt')
    // })

    // client.on('message', function (topic, message) {
    //   // message is Buffer
    //   console.log(message.toString())
    //   client.end()
    // })

    // 连接选项
    // const options = {
    // 	connectTimeout: 4000, // 超时时间
    // 	// 认证信息
    // 	clientId: 'emqx-connect-via-websocket',
    // 	username: 'emqx-connect-via-websocket',
    // 	password: 'emqx-connect-via-websocket',
    // }

    // 	const client = mqtt.connect("mqtt://test.mosquitto.org");

    // 	client.on('reconnect', (error) => {
    // 	    console.log('正在重连:', error);
    // 	});

    // 	client.on('error', (error) => {
    // 	    console.log('连接失败:', error);
    // 	});
    // 	client.on('connect', function () {
    // 		client.subscribe('presence');
    // 		client.publish('presence', 'Hello mqtt');
    // 	});

    // 	client.on('message', function (topic, message) {
    // 		// message is Buffer
    // 		console.log(message.toString());
    // 		client.end();
    // 	});

    // var client  = mqtt.connect('mqtt://127.0.0.1')

    // client.on('connect', function () {
    //   client.subscribe('presence')
    //   client.publish('presence', 'Hello mqtt')
    // })

    // client.on('message', function (topic, message) {
    //   // message is Buffer
    //   console.log(message.toString())
    //   client.end()
    // })

    // Create a client instance
    // var client = new Paho.Client("127.0.0.1", 1883, "clientId");

    // // set callback handlers
    // client.onConnectionLost = onConnectionLost;
    // client.onMessageArrived = onMessageArrived;

    // // connect the client
    // client.connect({onSuccess:onConnect});

    // // called when the client connects
    // function onConnect() {
    // 	debugger
    //   // Once a connection has been made, make a subscription and send a message.
    //   console.log("onConnect");
    //   client.subscribe("World");
    //   message = new Paho.MQTT.Message("Hello");
    //   message.destinationName = "World";
    //   client.send(message);
    // }

    // // called when the client loses its connection
    // function onConnectionLost(responseObject) {
    //   if (responseObject.errorCode !== 0) {
    //     console.log("onConnectionLost:"+responseObject.errorMessage);
    //   }
    // }

    // // called when a message arrives
    // function onMessageArrived(message) {
    //   console.log("onMessageArrived:"+message.payloadString);
    // }

    // var client = new Paho.MQTT.Client("test.mosquitto.org", Number(80), "");//建立客户端实例
    // client.connect({onSuccess:onConnect});//连接服务器并注册连接成功处理事件
    // function onConnect() {
    //     console.log("onConnected");

    //     topic = 'v1/devices/me/telemetry';

    //     client.subscribe(topic);//订阅主题
    //     console.log("subscribed");
    // }
    // client.onConnectionLost = onConnectionLost;//注册连接断开处理事件
    // client.onMessageArrived = onMessageArrived;//注册消息接收处理事件
    // function onConnectionLost(responseObject) {
    //     if (responseObject.errorCode !== 0) {
    //         console.log("onConnectionLost:"+responseObject.errorMessage);
    //         console.log("连接已断开");
    //      }
    // }
    // function onMessageArrived(message) {

    //     console.log("收到消息:"+message.payloadString);
    //     console.log("主题："+message.destinationName);

    // }

    //var mqtt = require ('mqtt');
    var client = mqtt.connect ('mqtt://test.mosquitto.org');

    client.on ('connect', function () {
      console.log ('connect');
      client.subscribe ('presence');
      client.publish ('presence', 'Hello mqtt');
    });

    client.on ('message', function (topic, message) {
      // message is Buffer
      console.log (message.toString ());
      client.end ();
    });
  }
  render () {
    return <div onClick={this.connect.bind (this)}>123</div>;
  }
}
