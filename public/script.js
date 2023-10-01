function updateUi(data) {
    
    document.getElementById("status").innerHTML = data.status;
    document.getElementById("motor1").innerHTML = data.motors.motor1.status;
    document.getElementById("motor2").innerHTML = data.motors.motor2.status;
    document.getElementById("lamp").innerHTML = data.lamp;
    document.getElementById("ev").innerHTML = (data.ev == 1) ? "Active" : "Disabled"; 
    console.log("updateUi executed");
}

const url = window.location.origin;
const socket = io.connect(url);

socket.on("newMqttMessage", function (data) {
    updateUi(data);
});

function updateData() {
    console.log("updateData");
    const conn_status = document.getElementById("status").textContent;
    const motor1_status = document.getElementById("motor1").textContent;
    const motor2_status = document.getElementById("motor2").textContent;
    const lamp_status = document.getElementById("lamp").textContent;
    const ev_status = document.getElementById("ev").textContent == "Active" ? "1" : "0";

    const data = {
        "status": conn_status,
        "motors" : {
            "motor1" : {
                "status": motor1_status,
                "speed": "1"
            },
            "motor2" : {
                "status": motor2_status,
                "speed": "2"
            },
        },
        "lamp" : lamp_status,
        "ev" : ev_status
    };

    socket.emit("MqttClientUpdate", data);
}