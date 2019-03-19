

import {observable, computed, toJS, autorun} from 'mobx';

import EventEmitter from 'events';

import mqttWorker from './mqttWorker';

import {PROTOCAL_REQUEST} from '../datacenter/protocol'

class MessageManager extends EventEmitter{
    cmdList =[];
    subscribe =[];

    constructor() {
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
      
          let protocal_value = Object.values(PROTOCAL_REQUEST);
          protocal_value.forEach(item => {
            this.subscribe.push(item + "/"+options.userName);
          });

          debugger;
          mqttWorker.emit ('session:init', this.subscribe);
          mqttWorker.emit ('session:connect', options);

          this.on ("register", (args) => {
            debugger;
            console.info ("注册消息:"+args.cmd);
            let index = -1;


            this.cmdList.push(args.cmd);
          });

          this.on ("unregister", (args) => {

            
            debugger;
            console.info ("取消注册消息:"+args.cmd);
          });

    }

    reset(){
        this.cmdList=[];
        this.subscribe =[];
    }

    addCommand(cmd){
       let index = -1;
        
    }

    removeCommand(cmd){

    }
}

export default new MessageManager ();