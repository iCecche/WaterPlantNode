let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
const mqtt = require("mqtt");
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

const opt = {
    host: process.env.IOT_ENDPOINT,
    protocol: "mqtt",
    clientId: process.env.THING_NAME,
    clean: true,
    key: process.env.PRIV_KEY,
    cert: process.env.CERT,
    ca: process.env.CA,
    reconnectPeriod: 0,
}; 

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
    console.log("[Message received]: " + parsedMessage.status);

    io.emit("newMqttMessage", parsedMessage);
});

client.on("error", (err) => {
    console.log("Error: " + err);
});

client.on("close", () => {
    console.log("Connection to the broker closed.");
});

//socket handlers
//routes

app.get('/', (req, res) => {
    res.render("dashboard");    
})

app.get("/updateData", (req, res) => {
 
})

//use server.listen instead of app.listen to use socket.io
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});