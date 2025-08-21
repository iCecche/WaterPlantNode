let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
const moment = require('moment-timezone');
const axios = require("axios");
const mqtt = require('mqtt');
const http = require('http');
const socketIO = require('socket.io');

const dotenv = require('dotenv');
dotenv.config();

let app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const server = http.createServer(app);
const io = socketIO(server);

const historical = [];

const opt = {
    clientID: process.env.CLIENTID,
    host: process.env.HOST,
    port: process.env.BROKERPORT,
    protocol: 'mqtts',
    protocolVersion: 5,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    keepalive: 300,
    will: {
        topic: 'status/online',
        payload: 'offline',
        qos: 1,
        retain: true
    }
}

const client = mqtt.connect(opt);

//MQTT Handler

client.on("connect", () => {
    console.log("Connected to the broker...");
    client.subscribe("picoW/sensor", (err) => {
        if(err) {
            console.log("Error subscribing to picoW/sensor")
        }else {
            console.log("Connected to picoW/sensor");
        }
    });
});

client.on("message", (topic, message) => {
    const parsedMessage = JSON.parse(message.toString()); //è un oggetto del tipo {"message": "the real message..."}
    //console.log("[Message received]: " + parsedMessage);
    
    
    parsedMessage.last_irrigation = calculateTime(parsedMessage.irrigation_time);
    parsedMessage.timeOfmisuration = parsedMessage.timeOfmisuration.replace("T", " ");
    //console.log("timeOfmisuration: ", parsedMessage.timeOfmisuration);
    //console.log("irrigation_time: ", parsedMessage.irrigation_time);


    if (historical.length >= 72 ) {
        historical.shift();
    }
    historical.push(parsedMessage);
    io.emit("newMqttMessage", historical);
});

client.on("error", (err) => {
    console.log("Error: " + err);
});

client.on("close", () => {
    const time = moment();
    console.log("Connection to the broker closed.");
    //console.log(time)
    client.reconnect();
});

//socket handlers

io.on('connection', (socket) => {
    //console.log('A user connected');
  
    //when the page is loaded/reloaded fill page with the last data retrieved
    socket.on('load', () => {
        let lastData = historical.at(historical.length-1);
        lastData.last_irrigation = calculateTime(lastData.irrigation_time)
        //console.log(lastData.last_irrigation);

        socket.emit('newMqttMessage', historical);
        //console.log('Received a custom message:', historical);
    });

    socket.on("new_moisture_limit", (value) => {
        client.publish('new_moisture_limit', value, { 
            retain: true,
            properties: {
                messageExpiryInterval: 3600
            }
        }, (err) => 
        {
           if (err) console.log(err);
           //else console.log("Message successfully published");
        });
    });

    socket.on("new_active_pump_for", (value) => {
        client.publish('new_active_pump_for', value, { 
            retain: true,
            properties: {
                messageExpiryInterval: 3600
            }
        }, (err) => 
        {
           if (err) console.log(err);
           //else console.log("Message successfully published");
        });
    });

    socket.on("new_misuration_interval", (value) => {
        client.publish('new_misuration_interval', value, { 
            retain: true,
            properties: {
                messageExpiryInterval: 3600
            }
        }, (err) => 
        {
           if (err) console.log(err);
           //else console.log("Message successfully published");
        });
    });

    socket.on("irrigate_now", (value) => {
        client.publish('irrigate_now', value, { 
            retain: true,
            properties: {
                messageExpiryInterval: 3600
            }
        }, (err) => 
        {
           if (err) console.log(err);
           //else console.log("Message successfully published");
        });
    });
});

//routes

app.get('/', async (req, res) => {
    const probability = await fetchWeather();
    res.render("dashboard", {
        rainProbability: probability
    });    
})

//use server.listen instead of app.listen to use socket.io
server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});

async function fetchWeather() {

    latitude = 43.751028
    longitude = 11.172644

    const url = `https://api.tomorrow.io/v4/weather/forecast`;
    const params = {
        location: `${latitude},${longitude}`,
        units: 'metric',
        timesteps: '1h',
        apikey: process.env.APIKEY
    };
    const data = await axios.get(url, {params}).then((response) => response.data);

    const forecast = data.timelines.hourly.slice(3,15);
    const weatherObject = forecast.find(h => h.values.precipitationProbability > 0);

    if(weatherObject != undefined) {
        const rainProbability = weatherObject.values.precipitationProbability;
        return rainProbability;
    }

    return 0;
}

function calculateTime(timestamp) {
      if (!timestamp) return "None";

      const date = moment.tz(timestamp, "Europe/Rome");
      const now = moment.tz("Europe/Rome");
      const diff = moment.duration(now.diff(date));

      if (diff.asSeconds() <= 0)
          return "None";

      if (diff.asSeconds() < 60) {
            return [Math.floor(diff.asSeconds()), "sec"];
      } else if (diff.asMinutes() < 60) {
            return [Math.floor(diff.asMinutes()), "min"];
      } else if (diff.asHours() < 24) {
            return [Math.floor(diff.asHours()), "h"];
      } else {
            return [Math.floor(diff.asDays()), "d"];
      }
}