const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = {};

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("join", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("userJoined", username);
  });

  socket.on("message", (message) => {
    const username = users[socket.id];
    const data = { username, message };
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit("userLeft", username);
    console.log("User disconnected");
  });
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
