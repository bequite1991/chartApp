import EventEmitter from 'events';

import messageManager from './messageManager';
import {Avatar} from 'antd';

let websocketWorker;

class WebsocketWorker extends EventEmitter {
  webSocket = null;
  messageList = [];
  options = null;
  isOpen = false;
  transactionId = '123456';
  projectCode = 'huibao';
  constructor () {
    super ();

    if (websocketWorker) {
      return websocketWorker;
    }

    this.on ('ws-connect', options => {
      //'ws://www.dtimao.com:8088/dtimao/webSocket/';
      // let sign ='eyJpZCI6InllIiwia2V5IjoiNDZDQzQ1QTcyN0JFQzdERTk3RjlFNzM4QUQ0MjgxNTMiLCJwcm9qZWN0Q29kZSI6Imh1aWJhbyIsInRpbWVzdGFtcCI6IjIwMTcxMTA2MTgxNDA2In0=';
      console.info (options);
      this.options = options;
      this.connect (this.options);
    });

    this.on ('ws-send', message => {
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

        let messageObj = JSON.stringify (messageBody);
        console.log ('messageObj:' + messageObj);
        if (messageObj) {
          this.webSocket.send (messageObj);
        }
      }
    });

    websocketWorker = this;
  }

  connect (options) {
    let url = options.url;
    let sign = options.key;

    console.info ('url:' + url);
    console.info ('sign:' + sign);
    this.webSocket = new WebSocket (url + sign);

    this.webSocket.onopen = event => {
      this.isOpen = true;
      if (messageManager) {
        messageManager.emit ('ws-open', {isOpen: this.isOpen});
      }
    };

    this.webSocket.onmessage = event => {
      let data = event.data;
      if (null == data || data.length == 0) return;
      console.log ('[' + this.getDatetime () + ']onMessage:' + data);

      let messageBody = JSON.parse (data);
      if (
        messageManager &&
        messageBody &&
        messageBody.cmd &&
        messageBody.cmd.length > 0
      ) {
        messageManager.addWSMessage (messageBody);
      }
    };

    this.webSocket.onclose = event => {
      this.isOpen = false;
    };

    this.webSocket.onerror = event => {
      console.log (event);
    };
  }

  getDatetime () {
    var now = new Date ();
    return (
      now.getFullYear () +
      '-' +
      now.getMonth () +
      '-' +
      now.getDate () +
      ' ' +
      (now.getHours () < 10 ? '0' + now.getHours () : now.getHours ()) +
      ':' +
      (now.getMinutes () < 10 ? '0' + now.getMinutes () : now.getMinutes ()) +
      ':' +
      (now.getSeconds () < 10 ? '0' + now.getSeconds () : now.getSeconds ())
    );
  }
}

websocketWorker = new WebsocketWorker ();

export default websocketWorker;
