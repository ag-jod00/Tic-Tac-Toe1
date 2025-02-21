const socket = io();
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
let player;

// Assign player role (X or O)
socket.on('assignPlayer', (role) => {
  player = role;
  statusText.textContent = `You are Player ${player}`;
});

// Spectator mode
socket.on('spectator', () => {
  statusText.textContent = 'You are a spectator';
});

// Handle cell clicks
cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    if (!player || cell.textContent !== '') return; // Prevent invalid moves
    const index = cell.getAttribute('data-index');
    socket.emit('move', { index, player });
  });
});

// Update the board with moves
socket.on('move', (data) => {
  const cell = document.querySelector(`.cell[data-index="${data.index}"]`);
  cell.textContent = data.player;
  cell.classList.add(data.player); // Add class for styling (X or O)
});
