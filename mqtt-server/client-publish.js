let mqtt = require ('mqtt');
let client = mqtt.connect ('mqtt://localhost:1883');

client.on ('connect', () => {
  setInterval (function () {
    let message = new Date ().toLocaleString ();
    //每隔1s发布主题为dialog的消息
    client.publish ('dialog', message, {
      qos: 0, //可以丢失
      retain: false, //不保留
    });
  }, 1000);
});
