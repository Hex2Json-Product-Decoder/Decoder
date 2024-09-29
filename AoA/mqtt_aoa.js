var zlib = require('zlib');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://test.mosquitto.org:1883');
const topic = '/cle';
client.on('connect',function(){client.subscribe(topic);});
client.on('message', function(top, message) {
        zlib.unzip(message, (err, buffer) => {
                if (err) return;
                const json = buffer.toString();
                console.log(JSON.stringify(json));
        });
});