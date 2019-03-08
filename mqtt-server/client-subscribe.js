let mqtt = require ('mqtt');
let client = mqtt.connect ('mqtt://localhost:1883');

client.on ('connect', () => {
  //订阅主题为dialog的消息
  client.subscribe ('dialog');
});
client.on ('message', (topic, message) => {
  //打印主题
  console.log (topic);
  //打印消息，是buffer形式
  console.log (message.toString ());
});
