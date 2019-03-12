import EventEmitter from 'events';

import mqttWorker from './mqttWorker';

/**
 * 客户端发送数据
 */
class ClientEmiter extends EventEmitter {
  constructor () {
    super ();

    // 初始化
    // ip,port,client名称
    mqttWorker.emit (
      CHANNEL_INIT,
      '121.43.165.110',
      '3994',
      'JSClient-Demo-' + new Date ().toLocaleTimeString ()
    );
  }

  set cwd (value) {
    this.cwdValue = value;
  }

  get cwd () {
    return this.cwdValue;
  }

  send (data) {
    spc.emit ('session:data', {
      cwd: this.cwd,
      data: decoder.write (data),
    });
  }

  newline () {
    spc.emit ('session:newline', {cwd: this.cwd});
  }
}
