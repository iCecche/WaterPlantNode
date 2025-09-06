let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
const moment = require('moment-timezone');
const axios = require("axios");
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');

// Import custom modules
const MqttService = require('./Services/mqttService');
const WeatherService = require('./Services/weatherService');
const DataProcessor = require('./Handlers/dataProcessor');
const SocketHandlers = require('./Handlers/socketHandlers');

dotenv.config();

let app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const server = http.createServer(app);
const io = socketIO(server);

// Initialize services
const dataProcessor = new DataProcessor();
const mqttService = new MqttService(process.env, dataProcessor);
const weatherService = new WeatherService(process.env.APIKEY);
const socketHandlers = new SocketHandlers(mqttService, dataProcessor);

// Start MQTT service
mqttService.connect();

// Setup socket handlers
socketHandlers.setupSocketHandlers(io);

// Routes
app.get('/', async (req, res) => {
    const probability = await weatherService.fetchWeather();
    res.render("dashboard", {
        rainProbability: probability
    });
});

// Use server.listen instead of app.listen to use socket.io
server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
