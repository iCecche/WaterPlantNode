let timeRecords = [];
let temperatureRecords = [];
let humidityRecords = [];
let soilMoistureRecords = [];
let batteryRecords = [];

const TemperatureChartOptions = {
    type: 'line',
    data: {
        labels: timeRecords,
        datasets: [{ 
            data: temperatureRecords,
            label: "Temperature",
            borderColor: "rgba(255, 63, 105, 1)",
            backgroundColor: 'rgba(255, 63, 105, 0.4)', 
            fill: false,
        }]
    },
    options : {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 40,
                ticks: {
                    stepSize: 1,
                }
            }
        }
    }
}

const SoilMoistureOptions = {
    type: 'line',
    data: {
        labels: timeRecords,
        datasets: [{ 
            data: soilMoistureRecords,
            label: "Moisture",
            borderColor: 'rgba(142, 111, 103,1)',
            backgroundColor: 'rgba(142, 111, 103, 0.4)',
            fill: false,
        }]
    },
    options : {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 5
                }
            }
        }
    }
}

const HumidityChartOptions = {
    type: 'line',
    data: {
        labels: timeRecords,
        datasets: [{ 
            data: humidityRecords,
            label: "Humidity",
            borderColor: 'rgba(3, 155, 255,1)',
            backgroundColor: 'rgba(3, 155, 255,1)',
            fill: false,
        }]
    },
    options : {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 5,
                }
            }
        }
    }
}

const BatteryChartOptions = {
    type: 'line',
    data: {
        labels: timeRecords,
        datasets: [{ 
            data: batteryRecords,
            label: "Battery",
            borderColor: "rgba(255, 255, 0,1)",
            backgroundColor: "rgba(255, 255, 0,0.4)",
            fill: false
        }]
    },
    options : {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 4.2,
                ticks: {
                    stepSize: 0.1,
                }
            }
        }
    }
}

const temperatureCtx = document.getElementById('temperature-chart').getContext('2d');
const humidityCtx = document.getElementById('humidity-chart').getContext('2d');
const soilMoistureCtx = document.getElementById('soil-moisture-chart').getContext('2d');
const batteryCtx = document.getElementById('battery-chart').getContext('2d');

const temperatureChart = makeChart(temperatureCtx, TemperatureChartOptions);
const soilMoistureChart = makeChart(soilMoistureCtx, SoilMoistureOptions);
const humidityChart = makeChart(humidityCtx, HumidityChartOptions);
const batteryChart = makeChart(batteryCtx, BatteryChartOptions);


function makeChart(ctx,opt) {
    let myChart = new Chart(ctx, opt);
    return myChart;
}

 function updateCharts() {
    temperatureChart.update();
    humidityChart.update();
    soilMoistureChart.update();
    batteryChart.update();
} 

function mapValue(voltage, minVoltage, maxVoltage) {
    return((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
}

function updateUi(data) {

    timeRecords.length = 0;
    temperatureRecords.length = 0;
    humidityRecords.length = 0;
    soilMoistureRecords.length = 0;
    batteryRecords.length = 0;

    console.log(data);

    data.forEach(obj => {
        timeRecords.push(obj.timeOfmisuration);
        temperatureRecords.push(obj.temperature);
        humidityRecords.push(obj.humidity);
        soilMoistureRecords.push(obj.soil_moisture);
        batteryRecords.push(obj.battery_level);
    });
    
    const lastData = data.at(data.length - 1);

    document.getElementById("temperature-value").textContent = lastData.temperature;
    document.getElementById("humidity-value").textContent = lastData.humidity;
    document.getElementById("soil-moisture-value").textContent = lastData.soil_moisture;
    document.getElementById("battery-value").textContent = lastData.battery_level.toFixed(2);
    document.getElementById("moisture-limit-value").value = lastData.soil_moisture_limit;
    document.getElementById("activate-pump-for-value").value = lastData.activate_pump_for;
    document.getElementById("misuration-interval-value").value = lastData.misuration_interval;

    if (lastData.last_irrigation === "None") {
        document.getElementById("last-irrigation-value").textContent = "None";
        document.getElementById("last-irrigation-unit").textContent = "";
    }else {
        document.getElementById("last-irrigation-value").textContent = lastData.last_irrigation[1];
        document.getElementById("last-irrigation-unit").textContent = lastData.last_irrigation[2];
    }
    
    updateCharts();
    console.log("updateUi executed");
}
//create dinamic alert pop-up and remove it after 10s
function CreateAlertMessage() {

    let alert_container = document.getElementById("alert-container")
    let alert = document.createElement("div");
    let icon_message = document.createElement('i');
    let span_message = document.createElement('span');

    alert.id = "success-alert";

    icon_message.className = 'material-icons ';
    icon_message.innerText = 'check_circle';

    span_message.innerText = "Message successfully published";

    alert.appendChild(icon_message);
    alert.appendChild(span_message);
    alert_container.appendChild(alert);

     setTimeout(function() {
        alert.remove(); // Hide the alert after 10 seconds
    }, 10000); // 10 seconds 
}

const url = window.location.origin;
const socket = io.connect(url);

socket.on("newMqttMessage", function (data) {
    updateUi(data);
});

window.addEventListener("load", (event) => {
    socket.emit("load");
    console.log("emitted notification");
});

let soil_button = document.getElementById("moisture-limit-btn");
soil_button.addEventListener("click", (event) => {
    let value = document.getElementById("moisture-limit-value").value
    
    socket.emit("new_moisture_limit", value);
    console.log("emitted notification");

    CreateAlertMessage();
});

let pump_active_button = document.getElementById("activate-pump-for-btn");
pump_active_button.addEventListener("click", (event) => {
    let value = document.getElementById("activate-pump-for-value").value
    
    socket.emit("new_active_pump_for", value);
    console.log("emitted notification");

    CreateAlertMessage();
});

let misuration_interval = document.getElementById("misuration-interval-btn");
misuration_interval.addEventListener("click", (event) => {
    let value = document.getElementById("misuration-interval-value").value
    
    socket.emit("new_misuration_interval", value);
    console.log("emitted notification");

    CreateAlertMessage();
});

let irrigate_now = document.getElementById("irrigate-now-btn");
irrigate_now.addEventListener("click", (event) => {
    let value = document.getElementById("irrigate-now-value").checked
    value = String(value)

    socket.emit("irrigate_now", value);
    console.log("emitted notification");

    CreateAlertMessage();
});