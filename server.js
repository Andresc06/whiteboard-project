const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();

// Set the port of the app
app.set("port", "3000");
app.use(cors({ origin: true, credentials: true }));
// Create a server
const server = http.createServer(app);

// When server is listening, send a console log message
server.on("listening", () => {
  console.log("Listening on port 3000");
});

// Server listening on port 3000
server.listen("3000");

// Import socket.io to our server
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  // Message to notify when the connection is established
  console.log("Client connected: " + socket.id);

  // When mouse event (created later) happens, it transmit the data as a broadcast
  socket.on("mouse", (data) => {
    socket.broadcast.emit("mouse", data);
  });

  // When disconnect, send a disconnect message
  socket.on("disconnect", () => console.log("Client disconnected"));
});
