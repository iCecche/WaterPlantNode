const mqttService = require("../Services/mqttService");

class SocketHandlers {
    constructor(mqttService, dataProcessor) {
        this.mqttService = mqttService;
        this.dataProcessor = dataProcessor;
    }

    setupSocketHandlers(io) {
        // Set the io instance in mqttService for message broadcasting
        this.mqttService.setSocketIO(io);

        io.on('connection', (socket) => {
            console.log('A user connected');

            // Handle page load/reload
            socket.on('load', () => {
                const historical = this.mqttService.getHistorical();
                const currentMeasurationInterval =  this.mqttService.getCurrentMisurationInterval();
                this.dataProcessor.processHistoricalData(historical);

                socket.emit('newMqttMessage', historical, currentMeasurationInterval);
            });

            // Handle moisture limit updates
            socket.on("new_moisture_limit", (value) => {
                this.mqttService.publishMoistureLimit(value);
            });

            // Handle active pump duration updates
            socket.on("new_active_pump_for", (value) => {
                this.mqttService.publishActivePumpFor(value);
            });

            // Handle misuration interval updates
            socket.on("new_misuration_interval", (value) => {
                this.mqttService.publishMisurationInterval(value);
            });

            // Handle immediate irrigation requests
            socket.on("irrigate_now", (value) => {
                this.mqttService.publishIrrigateNow(value);
            });

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        });
    }
}

module.exports = SocketHandlers;
