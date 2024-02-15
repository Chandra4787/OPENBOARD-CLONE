const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); // Initialized and server ready

let port = 3000;
let server = app.listen(port, () => {
    console.log("Listening to port " + port);
})

