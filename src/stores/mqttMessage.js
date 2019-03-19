import {observable, computed, toJS, autorun} from 'mobx';

import EventEmitter from 'events';

/**
 * mqtt消息状态存储管理，以所在目录为唯一坐标值。
 */
export default class mqttMessage {
  @observable cmd="";
  @observable num_id = "";
  @observable resp = "200"
  @observable token = "";

  constructor({ cmd, src , resp, token}) {
    this.cmd = cmd;
    this.src = src;
    this.resp = resp;
    this.token = token;

    let timestap = new Date ().getTime ();
    this.num_id = timestap.substring(0,20);
    this.timestap = timestap;
  }

}
