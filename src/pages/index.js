import React from 'react';
import {Button, Radio, Icon, Input, Table, Divider, Tag, Progress} from 'antd';
import md5 from 'js-md5';

let Base64 = require ('js-base64').Base64;

// import "antd/dist/antd.less";
// import "../../asset/style.less";

let key = md5 ('15051841028' + 'inshn_gwapi');
let time = new Date ().getTime ();
let token = Base64.encode ({cmd: '9001', key: key, timestamp: time});
let messageIndex = 0;

class Main extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      client: undefined,
      connect: undefined,
      subscribe: undefined,
      unSubscribe: undefined,
      // hasSubscribe: ['inshn_dtimao/huibao/req/dev_info/15051841028'],
      hasSubscribe: ['inshn_dtimao/huibao/req/dev_info.xiaoye'],

      //界面展示state
      newTopic: '',
      // newMessage: '',
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
      newMessage: JSON.stringify ({
        cmd: '9001',
        num_id: time + '' + messageIndex,
        // num_id: 201803031010250202,
        timestap: time,
        // src: 'inshn_dtimao.huibao.resp.dev_info',
        src: 'inshn_dtimao.huibao.resp.dev_info.xiaoye',
        resp: 200,
        token: token,
        // filter: ,
        // rows: {},
      }),
    };

    this.initSubscribe = this.initSubscribe.bind (this);
    this.subscribe = this.subscribe.bind (this);
    this.unSubscribe = this.unSubscribe.bind (this);
  }

  componentWillMount () {}

  componentWillReceiveProps (nextProps) {
    if (nextProps.subscribe !== this.state.subscribe) {
      this.subscribe (nextProps.subscribe);
    }
    if (nextProps.unSubscribe !== this.state.unSubscribe) {
      this.unSubscribe (nextProps.unSubscribe);
    }
  }
  topicChange = function (value) {
    this.setState ({newTopic: value.target.value});
  };

  messageChange = function (value) {
    this.setState ({newMessage: value.target.value});
  };

  connect () {
    //链接服务器
    // const { setConnect, setMessage } = this.props;
    var setConnect = function () {};
    var setMessage = function () {};
    let i = 0;

    // const client = new Paho.MQTT.Client (
    //   '127.0.0.1',
    //   7410,
    //   'JSClient-Demo-' + new Date ().toLocaleTimeString ()
    // );
    const client = new Paho.MQTT.Client (
      '121.43.165.110',
      3994,
      'JSClient-Demo-' + new Date ().toLocaleTimeString ()
    );
    // const client = new Paho.MQTT.Client('iot.wokooyun.com', 8083, "JSClient-Demo-" + new Date().toLocaleTimeString());
    const connectOpt = {
      userName: '15051841028',
      password: 'huibao1841028',
      cleanSession: true,
      timeout: 30,
      keepAliveInterval: 30,
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
      const {tableData} = this.state;
      message._index = ++i;
      setMessage (message);
      console.log (message);
      //message.destinationName
      // 维护数据界面
      // const newTableData = [].concat (tableData);

      // newTableData.forEach ((ele, key) => {
      //     if (ele.topic == message.destinationName) {
      //         ele.res = message.payloadString;
      //     }
      // });
      // this.setState ({
      //     tableData: newTableData,
      // });
    };

    client.connect (connectOpt);

    console.log ('mqtt connect ...');

    this.setState ({
      client,
    });
  }

  initSubscribe () {
    const {client, hasSubscribe, tableData} = this.state;
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
            // 维护数据界面
            // const newTableData = [].concat (tableData);
            // newTableData.push ({
            //     key: (new Date()).getTime(),
            //     topic: hasSubscribe[i],
            //     req: '',
            //     res: '',
            // });
            // this.setState({
            //     tableData: newTableData,
            // });
          },
        });
    }
  }

  subscribe (filter) {
    if (!filter) {
      return;
    }
    const {client, hasSubscribe, tableData} = this.state;
    // 维护数据界面
    const newTableData = [].concat (tableData);
    newTableData.push ({
      key: new Date ().getTime (),
      topic: filter,
      req: '',
      res: '',
    });

    client.isConnected () && client.subscribe (filter);
    hasSubscribe.push (filter);
    this.setState ({
      subscribe: filter,
      hasSubscribe,
      tableData: newTableData,
    });
    console.log ('mqtt subscribe', filter);
  }

  publish (topic, message, qos, retained) {
    //发送消息
    //界面展示相关  维护表格
    const {tableData, client} = this.state;
    const newTableData = [].concat (tableData);

    newTableData.forEach ((ele, key) => {
      if (ele.topic == topic) {
        ele.req = message;
      }
    });
    this.setState ({
      tableData: newTableData,
    });

    //mqtt数据相关
    var msgObj = new Paho.MQTT.Message (message);
    msgObj.destinationName = topic;
    if (qos) {
      msgObj.qos = qos;
    }
    if (retained) {
      msgObj.retained = retained;
    }
    debugger;
    console.log (msgObj.payloadString);
    client.send (msgObj);
  }

  unSubscribe (filter) {
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

export default Main;
