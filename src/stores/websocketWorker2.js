import EventEmitter from 'events';

import messageManager from './warningManager';

let websocketWorker2;

class WebsocketWorker2 extends EventEmitter {
  webSocket = null;
  messageList = [];
  options = null;
  isOpen = false;
  transactionId = '123456';
  projectCode = 'huibao';
  isConnected = false;
  constructor() {
    super();

    if (websocketWorker2) {
      return websocketWorker2;
    }

    this.on('ws-connect', options => {
      //'ws://www.dtimao.com:8088/dtimao/webSocket/';
      // let sign ='eyJpZCI6InllIiwia2V5IjoiNDZDQzQ1QTcyN0JFQzdERTk3RjlFNzM4QUQ0MjgxNTMiLCJwcm9qZWN0Q29kZSI6Imh1aWJhbyIsInRpbWVzdGFtcCI6IjIwMTcxMTA2MTgxNDA2In0=';
      console.info(options);
      this.options = options;
      this.connect(this.options);
      this.isConnected = true;
    });

    this.on('ws-send', message => {
      if (message) {
        /**
        '{"cmd":"1001","strAgent":["' +
  '900000000000001447",' +
  '"",' +
  '""' +
  '],"transactionId":"123456","projectCode":"huibao"}';
         */
        let strAgent = [message.dev_id];
        let messageBody = {
          cmd: message.cmd,
          strAgent: strAgent,
          transactionId: this.transactionId,
          projectCode: this.projectCode,
        };

        let messageObj = JSON.stringify(messageBody);
        console.log('messageObj:' + messageObj);
        if (messageObj) {
          this.webSocket.send(messageObj);
        }
      }
    });

    websocketWorker2 = this;
  }

  isWSConnected() {
    return this.isConnected;
  }

  connect(options) {
    let url = options.url;
    let sign = options.key;

    console.info('url:' + url);
    console.info('sign:' + sign);
    this.webSocket = new WebSocket(url + sign);

    this.webSocket.onopen = event => {
      this.isOpen = true;
      this.isConnected = true;
      if (messageManager) {
        messageManager.emit('ws-open', { isOpen: this.isOpen });
      }
    };

    this.webSocket.onmessage = event => {
      let data = event.data;
      if (null == data || data.length == 0) return;
      console.log('[' + this.getDatetime() + ']onMessage:' + data);

      let messageBody = JSON.parse(data);
      if (messageManager && messageBody && messageBody.cmd && messageBody.cmd.length > 0) {
        messageManager.addWSMessage(messageBody);
      }
    };

    this.webSocket.onclose = event => {
      this.isOpen = false;
      this.isConnected = false;
    };

    this.webSocket.onerror = event => {
      console.log(event);
      this.isConnected = false;
    };
  }

  getDatetime() {
    var now = new Date();
    return (
      now.getFullYear() +
      '-' +
      now.getMonth() +
      '-' +
      now.getDate() +
      ' ' +
      (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) +
      ':' +
      (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()) +
      ':' +
      (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds())
    );
  }
}

websocketWorker2 = new WebsocketWorker2();

export default websocketWorker2;
