let express = require('express');
let bodyParser = require('body-parser');
const mqtt = require("mqtt");
const http = require('http');
const socketIO = require('socket.io');
const cors = require("cors");

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

//MQTT Handlers

client.on("connect", () => {
    console.log("Connected to the broker...");
    client.subscribe("demo", (err) => {
        if(err) {
            console.log("Error subscribing to demo")
        }else {
            console.log("Connected to demo");
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

//routes

app.get('/', (req, res) => {
    res.render("dashboard");
})

app.get("/updateData", (req, res) => {
    const content = {
        "message":"Abbello i'm coming for youuuuu!"
    }    
    client.publish("demo", JSON.stringify(content) , (err) =>{
        if(err) {
            console.log("Error publishing to demo");
            client.end();
        }
    });
})

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});