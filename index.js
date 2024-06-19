const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./bin/helpers/databases/connection');
const authRoutes = require('./bin/app/routes/user');
const questionRoutes = require('./bin/app/routes/question');
const articleRoutes = require('./bin/app/routes/article');


const app = express();
const PORT = process.env.PORT || 9001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  }
});


app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Working");
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("socket connected");
  const users = [];

  for (let [id, socket] of io.of("/").sockets) {
    if (socket.handshake.auth.userId) {
      users.push({
        ...socket.handshake.auth,
        socketId: socket.handshake.auth.userId,
      });
    }
  }

  console.log("users", users);
  io.emit("user-connected", users);

  socket.on("join-room", ({ room, user }) => {
    users[user.userId] = user;
    socket.join(room);
  });

  socket.on("send-message", ({ message, room, user }) => {
    console.log("message", message, room, user);
    io.to(room).emit("receive-message", { message, user, room });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    const delUser = users.filter(
      (user) => user.socketId !== socket.handshake.auth.userId
    );
    console.log("disconnected users", delUser);
    io.emit("user-disconnected", delUser);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/article', articleRoutes);

// Database connection
connectDB();


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
