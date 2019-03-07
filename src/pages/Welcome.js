// export default () => (
//   <p style={{ textAlign: 'center' }}>
//     想要添加更多页面？请参考{' '}
//     <a href="https://umijs.org/guide/block.html" target="_blank" rel="noopener noreferrer">
//       umi 区块
//     </a>
//     。
//   </p>
// );


import React,{PureComponent} from 'react';
import mqtt from "mqtt";
// import Paho from "paho-mqtt/paho-mqtt.js";

export default class TodaySpec extends PureComponent{
	componentDidMount() {
	    this.getInfo();
	};
	getInfo(){
		// var Paho = require("paho-mqtt/paho-mqtt.js");
		// var client  = mqtt.connect('mqtt://127.0.0.1:1883');

		// client.on('connect', function () {
		//   client.subscribe('/inshn_dtimao/huibao/dev_info/user')
		//   client.publish('/inshn_dtimao/huibao/dev_info/user');
		// })

		// client.on('message', function (topic, message) {
		//   // message is Buffer
		//   console.log(message.toString())
		//   client.end()
		// })


		// var client  = mqtt.connect('mqtt://127.0.0.1:1883');

		// client.on('connect', function () {
		// 	debugger
		//   client.subscribe('presence')
		//   client.publish('presence', 'Hello mqtt')
		// })

		// client.on('message', function (topic, message) {
		//   // message is Buffer
		//   console.log(message.toString())
		//   client.end()
		// })

		// 连接选项
			// const options = {
			// 	connectTimeout: 4000, // 超时时间
			// 	// 认证信息
			// 	clientId: 'emqx-connect-via-websocket',
			// 	username: 'emqx-connect-via-websocket',
			// 	password: 'emqx-connect-via-websocket',
			// }

		// 	const client = mqtt.connect("mqtt://test.mosquitto.org");

		// 	client.on('reconnect', (error) => {
		// 	    console.log('正在重连:', error);
		// 	});

		// 	client.on('error', (error) => {
		// 	    console.log('连接失败:', error);
		// 	});
		// 	client.on('connect', function () {
		// 		client.subscribe('presence');
		// 		client.publish('presence', 'Hello mqtt');
		// 	});

		// 	client.on('message', function (topic, message) {
		// 		// message is Buffer
		// 		console.log(message.toString());
		// 		client.end();
		// 	});

			// var client  = mqtt.connect('mqtt://127.0.0.1')

			// client.on('connect', function () {
			//   client.subscribe('presence')
			//   client.publish('presence', 'Hello mqtt')
			// })

			// client.on('message', function (topic, message) {
			//   // message is Buffer
			//   console.log(message.toString())
			//   client.end()
			// })


			// Create a client instance
			// var client = new Paho.Client("127.0.0.1", 1883, "clientId");

			// // set callback handlers
			// client.onConnectionLost = onConnectionLost;
			// client.onMessageArrived = onMessageArrived;

			// // connect the client
			// client.connect({onSuccess:onConnect});


			// // called when the client connects
			// function onConnect() {
			// 	debugger
			//   // Once a connection has been made, make a subscription and send a message.
			//   console.log("onConnect");
			//   client.subscribe("World");
			//   message = new Paho.MQTT.Message("Hello");
			//   message.destinationName = "World";
			//   client.send(message);
			// }

			// // called when the client loses its connection
			// function onConnectionLost(responseObject) {
			//   if (responseObject.errorCode !== 0) {
			//     console.log("onConnectionLost:"+responseObject.errorMessage);
			//   }
			// }

			// // called when a message arrives
			// function onMessageArrived(message) {
			//   console.log("onMessageArrived:"+message.payloadString);
			// }



			var client = new Paho.MQTT.Client("test.mosquitto.org", Number(80), "");//建立客户端实例
        	client.connect({onSuccess:onConnect});//连接服务器并注册连接成功处理事件
            function onConnect() {
                console.log("onConnected");

                topic = 'v1/devices/me/telemetry';

                client.subscribe(topic);//订阅主题
                console.log("subscribed");
            }
            client.onConnectionLost = onConnectionLost;//注册连接断开处理事件
            client.onMessageArrived = onMessageArrived;//注册消息接收处理事件
            function onConnectionLost(responseObject) {
                if (responseObject.errorCode !== 0) {
                    console.log("onConnectionLost:"+responseObject.errorMessage);
                    console.log("连接已断开");
                 }
            }
            function onMessageArrived(message) {

                console.log("收到消息:"+message.payloadString);
                console.log("主题："+message.destinationName);

            }
			


		};
    render(){
        return(
            <div>123</div>	
        )
    }
}

