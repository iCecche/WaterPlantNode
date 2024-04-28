let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
const moment = require('moment');
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
    console.log("[Message received]: " + parsedMessage);
    
    
    parsedMessage.last_irrigation = calculateTime(parsedMessage.irrigation_time);
    parsedMessage.timeOfmisuration = parsedMessage.timeOfmisuration.replace("T", " ");
    console.log("timeOfmisuration: ", parsedMessage.timeOfmisuration);
    console.log("irrigation_time: ", parsedMessage.irrigation_time);


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
    console.log(time)
    client.reconnect();
});

//socket handlers

io.on('connection', (socket) => {
    console.log('A user connected');
  
    //when the page is loaded/reloaded fill page with the last data retrieved
    socket.on('load', () => {
        let lastData = historical.at(historical.length-1);
        lastData.last_irrigation = calculateTime(lastData.irrigation_time)
        console.log(lastData.last_irrigation);

        socket.emit('newMqttMessage', historical);
        console.log('Received a custom message:', historical);
    });

    socket.on("new_moisture_limit", (limit) => {
        client.publish('new_moisture_limit', limit, (err) => 
        {
           if (err) console.log(err);
           else console.log("Message successfully published");
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
    
    const url = "https://api.tomorrow.io/v4/weather/forecast?location=scandicci&timesteps=1h&units=metric&apikey="+ process.env.APIKEY;
    const data = await axios.get(url).then((response) => response.data);

    const forecast = data.timelines.hourly.slice(3,15);
    const weatherObject = forecast.find(h => h.values.precipitationProbability > 0);

    if(weatherObject != undefined) {
        const rainProbability = weatherObject.values.precipitationProbability;
        return rainProbability;
    }

    return 0;
}

function calculateTime(timestamp) {

    if(timestamp == 0) return "None";

    const format = "YYYY-MM-DD HH:mm:ss"; 
    
    let date = moment(timestamp).format(format);
    let difference = moment(date).fromNow(true);

    return extractSubstrings(difference);
}

function extractSubstrings(string) {

    const convertedString = convertTimeUnitsAbbreviations(string);
    const regex = /^(\w+).* (\w+)$/i
    let newStrings =  convertedString.match(regex);

    if (newStrings[1].charAt(0) === "a") newStrings[1] = "1";
    return newStrings;
}

function convertTimeUnitsAbbreviations(inputString) {
    const timeUnits = [
      { full: 'hours', abbreviation: 'h' },
      { full: 'minutes', abbreviation: 'min' },
      { full: 'seconds', abbreviation: 'sec' },
      { full: 'minute', abbreviation: 'min' },
      { full: 'second', abbreviation: 'sec' },
      // Add other time units as needed
    ];
  
    const regexPattern = new RegExp(timeUnits.map(unit => unit.full).join('|'), 'gi');
    
    return inputString.replace(regexPattern, match => timeUnits.find(unit => unit.full.toLowerCase() === match.toLowerCase())?.abbreviation || match);
}