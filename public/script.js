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
            borderColor: "#ef4444",
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#ef4444",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        family: 'Inter',
                        size: 14
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                beginAtZero: true,
                max: 40,
                ticks: {
                    stepSize: 5,
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
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
            label: "Soil Moisture",
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#a855f7",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        family: 'Inter',
                        size: 14
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 10,
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
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
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        family: 'Inter',
                        size: 14
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 10,
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
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
            borderColor: "#06b6d4",
            backgroundColor: "rgba(6, 182, 212, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#06b6d4",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        family: 'Inter',
                        size: 14
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                beginAtZero: true,
                max: 4.2,
                ticks: {
                    stepSize: 0.2,
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
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

function makeChart(ctx, opt) {
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

function updateIndicators(data) {
    const lastData = data.at(data.length - 1);

    // Update temperature indicator
    const tempPercentage = Math.min((lastData.temperature / 40) * 100, 100);
    document.getElementById("temperature-indicator").style.setProperty('--indicator-width', `${tempPercentage}%`);

    // Update humidity indicator
    const humidityPercentage = lastData.humidity;
    document.getElementById("humidity-indicator").style.setProperty('--indicator-width', `${humidityPercentage}%`);

    // Update soil moisture indicator
    const soilMoisturePercentage = lastData.soil_moisture;
    document.getElementById("soil-moisture-indicator").style.setProperty('--indicator-width', `${soilMoisturePercentage}%`);

    // Update battery indicator
    const batteryPercentage = Math.min((lastData.battery_level / 4.2) * 100, 100);
    document.getElementById("battery-indicator").style.setProperty('--indicator-width', `${batteryPercentage}%`);

    // Update irrigation indicator (example based on hours since last irrigation)
    const irrigationPercentage = lastData.last_irrigation !== "None" ?
        Math.max(100 - (lastData.last_irrigation[1] * 10), 0) : 0;
    document.getElementById("irrigation-indicator").style.setProperty('--indicator-width', `${irrigationPercentage}%`);

    // Update forecast indicator (rain probability)
    const forecastPercentage = Math.random() * 100; // Replace with actual forecast data
    document.getElementById("forecast-indicator").style.setProperty('--indicator-width', `${forecastPercentage}%`);
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
    } else {
        document.getElementById("last-irrigation-value").textContent = lastData.last_irrigation[1];
        document.getElementById("last-irrigation-unit").textContent = lastData.last_irrigation[2];
    }

    updateIndicators(data);
    updateCharts();
    console.log("updateUi executed");
}

function CreateAlertMessage() {
    let alert_container = document.getElementById("alert-container");
    let alert = document.createElement("div");
    let icon_message = document.createElement('i');
    let span_message = document.createElement('span');

    alert.className = "alert";

    icon_message.className = 'material-icons';
    icon_message.innerText = 'check_circle';

    span_message.innerText = "Message successfully published";

    alert.appendChild(icon_message);
    alert.appendChild(span_message);
    alert_container.appendChild(alert);

    setTimeout(function() {
        alert.remove();
    }, 10000);
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
    let value = document.getElementById("moisture-limit-value").value;

    socket.emit("new_moisture_limit", value);
    console.log("emitted notification");

    CreateAlertMessage();
});

let pump_active_button = document.getElementById("activate-pump-for-btn");
pump_active_button.addEventListener("click", (event) => {
    let value = document.getElementById("activate-pump-for-value").value;

    socket.emit("new_active_pump_for", value);
    console.log("emitted notification");

    CreateAlertMessage();
});

let misuration_interval = document.getElementById("misuration-interval-btn");
misuration_interval.addEventListener("click", (event) => {
    let value = document.getElementById("misuration-interval-value").value;

    socket.emit("new_misuration_interval", value);
    console.log("emitted notification");

    CreateAlertMessage();
});

let irrigate_now = document.getElementById("irrigate-now-btn");
irrigate_now.addEventListener("click", (event) => {
    let value = document.getElementById("irrigate-now-value").checked;
    value = String(value);

    socket.emit("irrigate_now", value);
    console.log("emitted notification");

    CreateAlertMessage();
});