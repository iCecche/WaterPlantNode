let express = require('express');
let bodyParser = require('body-parser');
const mqtt = require("mqtt");

const dotenv = require('dotenv');
dotenv.config();

let app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

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

client.on("connect", () => {
	console.log("Connected to the broker...");
    client.subscribe("demo", (err) => {
        if(err) {
            console.log("Error subscribing to demo")
        }else {
            console.log("Connected to demo");
        }
    });
    const content = {
        "message":"Abbello i'm coming for youuuuu!"
    }    
    client.publish("demo", JSON.stringify(content) , (err) =>{
        if(err) {
            console.log("Error publishing to demo");
            client.end();
        }
    });
});

client.on("message", (topic, message) => {
    const parsedMessage = JSON.parse(message.toString()); //è un oggetto del tipo {"message": "the real message..."}
    console.log("[Message received]: " + parsedMessage.message);
});

client.on("error", (err) => {
    console.log("Error: " + err);
});

client.on("close", () => {
    console.log("Connection to the broker closed.");
  });

app.get('/', (req, res) => {
    res.send('GET request to homepage')
})

app.listen(3000, () => {
    console.log("app is listening on port 3000")
});