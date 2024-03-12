let timeRecords = [];
let temperatureRecords = [];
let humidityRecords = [];
let soilMoistureRecords = [];

const TemperatureChartOptions = {
    type: 'line',
    data: {
        labels: timeRecords,
        datasets: [{ 
            data: temperatureRecords,
            label: "Temperature",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false
        }]
    },
    options : {
        scales: {
            y: {
                beginAtZero: true,
                max: 40,
                ticks: {
                    stepSize: 1,
                    steps: 5
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
            label: "Total",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false
        }]
    },
    options : {
        scales: {
            y: {
                beginAtZero: true,
                max: 101,
                ticks: {
                    stepSize: 5,
                    steps: 5
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
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false
        }]
    },
    options : {
        scales: {
            y: {
                beginAtZero: true,
                max: 101,
                ticks: {
                    stepSize: 5,
                    steps: 5
                }
            }
        }
    }
}

const temperatureCtx = document.getElementById('temperature-chart').getContext('2d');
const humidityCtx = document.getElementById('humidity-chart').getContext('2d');
const soilMoistureCtx = document.getElementById('soil-moisture-chart').getContext('2d');

const temperatureChart = makeChart(temperatureCtx, TemperatureChartOptions);
const soilMoistureChart = makeChart(soilMoistureCtx, SoilMoistureOptions);
const humidityChart = makeChart(humidityCtx, HumidityChartOptions);


function makeChart(ctx,opt) {
    let myChart = new Chart(ctx, opt);
    return myChart;
}

 function updateCharts() {
    temperatureChart.update();
    humidityChart.update();
    soilMoistureChart.update();
} 

function updateUi(data) {

    timeRecords.length = 0;
    temperatureRecords.length = 0;
    humidityRecords.length = 0;
    soilMoistureRecords.length = 0;

    console.log(data);

    data.forEach(obj => {
        timeRecords.push(obj.timeOfmisuration);
        temperatureRecords.push(obj.temperature);
        humidityRecords.push(obj.humidity);
        soilMoistureRecords.push(obj.soil_moisture);
    });
    
    const lastData = data.at(data.length - 1);

    document.getElementById("temperature-value").textContent = lastData.temperature;
    document.getElementById("humidity-value").textContent = lastData.humidity;
    document.getElementById("soil-moisture-value").textContent = lastData.soil_moisture;
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

const url = window.location.origin;
const socket = io.connect(url);

socket.on("newMqttMessage", function (data) {
    updateUi(data);
});

window.addEventListener("load", (event) => {
    socket.emit("load");
    console.log("emitted notification");
});

let button = document.getElementById("TESTBUTTON");
button.addEventListener("click", (event) => {
    socket.emit("new_moisture_limit", "5");
    console.log("emitted notification");
});
