const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors module
const connectDB = require('./bin/helpers/databases/connection');
const authRoutes = require('./bin/app/routes/user');
const questionRoutes = require('./bin/app/routes/question');
const articleRoutes = require('./bin/app/routes/article');


const app = express();
const PORT = process.env.PORT || 9001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow requests from any frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});



// Use CORS middleware
app.use(cors());

app.use(upload.array());
app.use(express.json());

// Define a route for the root (/) endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Socket.io connection handling
io.on("connection", (socket) => {
  // Your existing socket.io logic here
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