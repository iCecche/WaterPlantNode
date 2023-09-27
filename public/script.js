function updateData() {

}

function updateUi(data) {
    document.getElementById("status").innerHTML = data.status;
    document.getElementById("motor1").innerHTML = data.motors.motor1.status;
    document.getElementById("motor2").innerHTML = data.motors.motor2.status;
    document.getElementById("lamp").innerHTML = data.lamp;
    document.getElementById("ev").innerHTML = (data.ev == 1) ? "Active" : "Disabled";
    console.log("updateUi executed");
}

const socket = io.connect('http://localhost:3000');

socket.on("newMqttMessage", function (data) {
    updateUi(data);
});