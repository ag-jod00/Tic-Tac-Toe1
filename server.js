const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.IO for real-time communication
let players = {};
let currentPlayer = 'X';

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Assign a player (X or O)
  if (Object.keys(players).length < 2) {
    players[socket.id] = currentPlayer;
    socket.emit('assignPlayer', currentPlayer);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  } else {
    socket.emit('spectator');
  }

  // Handle player moves
  socket.on('move', (data) => {
    io.emit('move', data); // Broadcast the move to all clients
  });

  // Handle player disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete players[socket.id];
    if (Object.keys(players).length === 0) {
      currentPlayer = 'X'; // Reset player assignment
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
