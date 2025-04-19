🎮 Multiplayer Tic-Tac-Toe
A real-time 2-player Tic-Tac-Toe game using React, Node.js, Express, and Socket.IO.

⚙️ Structure
Backend (Node.js + Express)

Manages sessions, rooms, and game state using in-memory Maps.

Socket.IO handles real-time communication.

Middleware validates user sessions via cookies.

Frontend (React)

Handles UI, game board, and socket events.

🔄 Game Flow
Login → Session created and stored via cookie.

Create / Join Room → Players are added to a room via /create-room or /join-room.

Start Game → When both players are in, server emits game_start.

Gameplay → Moves are synced with make_move, server checks for win or draw.

End → Winner declared or game ends in a draw.

Win & Draw Check
After each move:

checkWinner(board) compares against all win patterns.
If no winner and board is full → it's a draw.


🚀 Getting Started

1.Install dependencies:

In both client and server directories run: npm install

2.Start the server: in server directory run: npm start

3.Start the client: in client directory run: npm start
