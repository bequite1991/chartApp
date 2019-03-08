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
import {Button, Radio, Icon, Input, Table, Divider, Tag, Progress} from 'antd';
require ('../services/utils/mqttws31');

export default class TodaySpec extends PureComponent {
  client = null;

  // defaultServer = '121.43.165.110';
  // defaultServer = '222.73.204.54';
  defaultServer = '127.0.0.1';
  // defaultPort = 3994; //9001;
  // defaultPort = 9001;
  defaultPort = 7410;
  defaultSubTopic = '#';
  defaultPubTopic = 'alert';
  defaultPubMessage = '';

  server = ''; //getUrlVars ()['ip'] == null ? defaultServer : getUrlVars ()['ip'];
  port = 3994;
  subTopics = [];
  moreTopics = true;
  baseUrlVar = 'subTopic';
  urlVar = '';
  count = 1;
  hasSubTopics = false;

  username = '15051841028';
  password = 'huibao1841028';
  useSSL = false;
  qos = 1;
  autoSubscribe = false;
  autoPublish = false;

  constructor (props) {
    super (props);
    this.state = {
      newTopic: '',
      newMessage: '',
      connectStatus: 0,
      columns: [
        {
          title: '订阅主题',
          dataIndex: 'name',
          key: 'name',
          render: text => <a href="javascript:;">{text}</a>,
        },
        {
          title: '发送消息',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '返回数据',
          dataIndex: 'address',
          key: 'address',
        },
      ],
      tableData: [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser'],
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
        },
      ],
    };
  }

  componentDidMount () {
    const t = this;
    //this.getInfo ();
    this.client = null;
    //this.username = '';
    //this.password = '';

    this.clientId = 'MQTTHelper-' + Math.floor (10000 + Math.random () * 90000);

    this.server = this.defaultServer;
    this.port = this.defaultPort;
    //this.useSSL = true;
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

    t.client.onConnectionLost = t.onConnectionLost;

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
      console.info ('Connected to ' + t.server + ':' + t.port);
      t.setState ({connectStatus: 100});
      if (t.autoSubscribe) {
        var time = 500;
        for (var i in t.subTopics) {
          setTimeout (
            (function (topic) {
              return function () {};
            }) (t.subTopics[i]),
            time
          );
          time += 100;
        }
      }
      if (t.autoPublish) {
        setTimeout (function () {}, 500);
      }
    };

    connectOptions.onFailure = function (error) {
      console.info (
        'Failed to connect to ' +
          t.server +
          ':' +
          t.port +
          '.  Code: ' +
          error.errorCode +
          ', Message: ' +
          error.errorMessage
      );
    };
    // connectOptions.onSuccess.bind (t);
    // connectOptions.onFailure.bind (t);
    // debugger
    t.connectOptions = connectOptions;
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
    debugger;
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
    debugger;
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
    t.subsList = {};
  }

  closeConnect () {
    this.client.disconnect ();
  }

  subscribe (topic, qos) {
    const t = this;
    this.client.subscribe (topic, {
      qos: qos,
      onSuccess: function () {
        debugger;
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
      onFailure: function (err) {
        console.info ('Subscription failed: [' + topic + '][qos ' + qos + ']');
      },
    });
  }

  topicChange = value => {
    this.setState ({newTopic: value.target.value});
  };

  messageChange = value => {
    this.setState ({newMessage: value.target.value});
  };

  render () {
    const {
      newTopic,
      newMessage,
      tableData,
      columns,
      connectStatus,
    } = this.state;
    return (
      <div>
        <Progress type="circle" percent={connectStatus} />
        <Button
          onClick={this.connect.bind (this)}
          type="primary"
          size="default"
        >
          链接服务器
        </Button>
        <Input
          placeholder="填写主题"
          value={newTopic}
          onChange={this.topicChange}
        />
        <Button
          onClick={this.subscribe.bind (this, newTopic, 1)}
          type="primary"
          size="default"
        >
          订阅主题
        </Button>
        <Input
          placeholder="填写消息内容"
          value={newMessage}
          onChange={this.messageChange}
        />
        <Button
          onClick={this.publish.bind (this, newTopic, newMessage, 1, false)}
          type="primary"
          size="default"
        >
          发送消息
        </Button>
        <Table columns={columns} dataSource={tableData} />
      </div>
    );
  }
}
