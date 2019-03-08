var mosca = require ('mosca');

var ascoltatore = {
  //using ascoltatore
  //type: 'mongo',
  //url: 'mongodb://localhost:27017/mqtt',
  //pubsubCollection: 'ascoltatori',
  //mongo: {}
};

var settings = {
  static: './public',
  port: 1883,
  backend: ascoltatore,
  http: {
    bundle: true,
    port: 7410,
    static: './public',
  },
};

var server = new mosca.Server (settings);

server.on ('ready', function () {
  console.log ('mqtt server started');
});

server.on ('published', function (packet, client) {
  var topic = packet.topic;
  switch (topic) {
    case 'other':
      {
        console.log ('other published', packet.payload.toString ());
        // server.publish (
        //   {topic: topic, payload: topic + ' published ok!', qos: 1},
        //   client
        // );
        break;
      }
      break;
  }
});

server.on ('subscribed', function (topic, client) {
  console.log ('subscribed: ', topic);
  // server.publish (
  //   {topic: topic, payload: topic + ' published ok!', qos: 1},
  //   client
  // );
});

server.on ('unSubscribed', function (topic, client) {
  console.log ('unSubscribed: ', topic);
});

server.on ('clientConnected', function (client) {
  console.log ('client connected: ', client.id);
});

server.on ('clientDisConnected', function (client) {
  console.log (
    'client disConnected: ' + client.id + ' userNumber:' + usermap.keys.length
  );
});

server.on ('error', function (err) {
  console.log (err);
});
