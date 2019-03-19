

import {observable, computed, toJS, autorun} from 'mobx';

import EventEmitter from 'events';

import mqttWorker from './mqttWorker';

import {PROTOCAL_REQUEST} from '../datacenter/protocol'

class MessageManager extends EventEmitter{

    constructor({}) {
        super();
        
        debugger;
        let options = {
            ip: '121.43.165.110',
            port: 3994,
            userName: '15051841028',
            passWord: 'huibao1841028',
            clientName: 'JSClient-Demo-' + new Date ().toLocaleTimeString (),
            cleanSession: true,
            timeout: 30,
            keepAliveInterval: 30,
          };
      
          let subscribe = [
            //'/inshn_dtimao/huibao/req/dev_info/' + options.userName,
          ];

          let protocal_value = Object.values(PROTOCAL_REQUEST);
          protocal_value.forEach(item => {
            subscribe.push(item + options.userName);
          });

          debugger;
          mqttWorker.emit ('session:init', subscribe);
          mqttWorker.emit ('session:connect', options);
    }
}

export default new MessageManager ();