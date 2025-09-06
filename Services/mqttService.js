const mqttService = require('mqtt');
const moment = require('moment-timezone');

class MqttService {
    constructor(config, dataProcessor) {
        this.config = config;
        this.client = null;
        this.currentMisurationInterval = 3600; // Default value in seconds
        this.lastMisurationTime = null;
        this.historical = [];
        this.io = null;
        this.dataProcessor = dataProcessor;

        this.mqttOptions = {
            clientID: config.CLIENTID,
            host: config.HOST,
            port: config.BROKERPORT,
            protocol: 'mqtts',
            protocolVersion: 5,
            username: config.USERNAME,
            password: config.PASSWORD,
            keepalive: 300,
            will: {
                topic: 'status/online',
                payload: 'offline',
                qos: 1,
                retain: true
            }
        };
    }

    setSocketIO(io) {
        this.io = io;
    }

    connect() {
        this.client = mqttService.connect(this.mqttOptions);

        this.client.on("connect", () => {
            console.log("Connected to the broker...");
            this.client.subscribe("picoW/sensor", (err) => {
                if(err) {
                    console.log("Error subscribing to picoW/sensor");
                } else {
                    console.log("Connected to picoW/sensor");
                }
            });
        });

        this.client.on("message", (topic, message) => {
            this.handleMessage(topic, message);
        });

        this.client.on("error", (err) => {
            console.log("Error: " + err);
        });

        this.client.on("close", () => {
            console.log("Connection to the broker closed.");
            this.client.reconnect();
        });
    }

    handleMessage(topic, message) {
        const parsedMessage = JSON.parse(message.toString());

        // Update misuration interval if present in message
        if (parsedMessage.misuration_interval && parsedMessage.timeOfmisuration) {
            this.currentMisurationInterval = parsedMessage.misuration_interval;

            parsedMessage.timeOfmisuration = parsedMessage.timeOfmisuration.replace("T", " ");
            this.lastMisurationTime = parsedMessage.timeOfmisuration;
        }

        if (this.historical.length >= 72) {
            this.historical.shift();
        }

        this.historical.push(parsedMessage);
        this.dataProcessor.processHistoricalData(this.historical)

        if (this.io) {
            this.io.emit("newMqttMessage", this.historical);
        }
    }

    getRetainOptions() {

        const nextMisuration = moment(this.lastMisurationTime).valueOf() + (this.currentMisurationInterval * 1000)
        const now = moment.now();
        const expirySec = (( nextMisuration - now ) / 1000) + 600 // additional 5 minutes for buffer

        return {
            retain: true,
            properties: {
                messageExpiryInterval: expirySec
            }
        };
    }

    publishMessage(topic, value, callback) {
        const options = this.getRetainOptions();

        this.client.publish(topic, value, options, (err) => {
            if (callback) callback(err);
        });
    }

    publishMoistureLimit(value) {
        this.publishMessage('new_moisture_limit', value);
    }

    publishActivePumpFor(value) {
        this.publishMessage('new_active_pump_for', value);
    }

    publishMisurationInterval(value) {
        // Update local misuration interval before publishing
        this.publishMessage('new_misuration_interval', value);
        this.currentMisurationInterval = parseInt(value);
    }

    publishIrrigateNow(value) {
        this.publishMessage('irrigate_now', value);
    }

    getHistorical() {
        return this.historical;
    }

    getCurrentMisurationInterval() {
        return this.currentMisurationInterval;
    }
}

module.exports = MqttService;
