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

  toClose = false;

  constructor (props) {
    super (props);
    this.state = {
      newTopic: '',
      newMessage: '',
      connectStatus: 0,
      columns: [
        {
          title: '订阅主题',
          dataIndex: 'topic',
          key: 'topic',
          render: text => <a href="javascript:;">{text}</a>,
        },
        {
          title: '发送消息',
          dataIndex: 'req',
          key: 'req',
        },
        {
          title: '返回数据',
          dataIndex: 'res',
          key: 'res',
        },
      ],
      tableData: [],
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
    debugger;
    const t = this;
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

      t.showMessage (topic, payload, qosStr);
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

      if (!t.toClose) {
        setTimeout (function () {
          t.connect ();
        }, 2000);
      }
    };
    connectOptions.onSuccess.bind (t);
    connectOptions.onFailure.bind (t);
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

  showMessage (topic, message, qos) {
    const {tableData} = this.state;
    const newTableData = [].concat (tableData);

    newTableData.forEach ((ele, key) => {
      if (ele.key == topic) {
        ele.res = message + ':' + qos;
      }
    });
    this.setState ({
      tableData: newTableData,
    });
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
    const {tableData} = this.state;
    const newTableData = [].concat (tableData);

    var msgObj = new Paho.MQTT.Message (message);
    msgObj.destinationName = topic;
    if (qos) {
      msgObj.qos = qos;
    }
    if (retained) {
      msgObj.retained = retained;
    }

    newTableData.forEach ((ele, key) => {
      if (ele.key == topic) {
        ele.req = msgObj;
      }
    });
    t.setState ({
      tableData: newTableData,
    });

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
    t.subsList = {};

    if (!t.toClose) {
      setTimeout (function () {
        t.connect ();
      }, 2000);
    }
  }

  closeConnect () {
    this.toClose = true;
    this.client.disconnect ();
  }

  subscribe (topic, qos) {
    const t = this;
    const {tableData} = this.state;
    const newTableData = [].concat (tableData);
    newTableData.push ({
      key: topic,
      topic: topic,
      req: '',
      res: '',
    });
    this.setState ({
      tableData: newTableData,
    });
    this.subTopics.push (topic);
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
      onFailure: function (err) {
        console.info ('Subscription failed: [' + topic + '][qos ' + qos + ']');
      },
    });
  }

  topicChange = function (value) {
    this.setState ({newTopic: value.target.value});
  };

  messageChange = function (value) {
    this.setState ({newMessage: value.target.value});
  };

  render () {
    const {
      subTopics,
      newTopic,
      newMessage,
      tableData,
      columns,
      connectStatus,
    } = this.state;
    let newtableData = [];
    if (tableData.length > 30) {
      newtableData = tableData.slice (1);
    } else {
      newtableData = tableData;
    }
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
          onChange={this.topicChange.bind (this)}
        />
        <Button
          onClick={this.subscribe.bind (this, newTopic, 1)}
          type="primary"
          size="default"
        >
          订阅主题
        </Button>
        <span>{subTopics}</span>
        <Input
          placeholder="填写消息内容"
          value={newMessage}
          onChange={this.messageChange.bind (this)}
        />
        <Button
          onClick={this.publish.bind (this, newTopic, newMessage, 1, false)}
          type="primary"
          size="default"
        >
          发送消息
        </Button>
        <Table columns={columns} dataSource={newtableData} />
      </div>
    );
  }
}
