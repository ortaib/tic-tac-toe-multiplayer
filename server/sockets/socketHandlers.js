const cookie = require('cookie');
const { checkWinner, checkDraw } = require('../utils/gameUtils');

function initSocketHandlers(io, sessions, rooms, games) {
  io.on("connection", (socket) => {
    socket.on("join_game", ({ roomCode }) => {
      const cookies = socket.handshake.headers.cookie;
      const parsedCookies = cookie.parse(cookies || "");
      const sessionId = parsedCookies.sessionId;
      const session = sessions.get(sessionId);

      if (sessionId) {
        socket.data.sessionId = sessionId;
        socket.data.playerName = session.name
      } else {
        console.log("No sessionId in the handshake.");
      }
      socket.join(roomCode);
    });

    socket.on("start_game", ({ roomCode }) => {
      const room = rooms.get(roomCode);
      const game = games.get(roomCode);
      io.to(roomCode).emit("game_start", {
        roomCode, host: room.hostName, guest: room.guestName,
        currentTurn: game.currentTurn, board: game.board
      });
    })

    socket.on("make_move", ({ roomCode, index }) => {
      const game = games.get(roomCode);
      if (!game) return;

      const currentPlayer = socket.data.playerName;
      if (game.currentTurn !== currentPlayer || game.board[index]) return;
      game.board[index] = game.players.indexOf(currentPlayer) === 0 ? "X" : "O";
      game.currentTurn = game.players.find(p => p !== currentPlayer);
      const winner = checkWinner(game.board)
      const draw = checkDraw(game.board)
      io.to(roomCode).emit("game_update", {
        board: game.board,
        currentTurn: game.currentTurn,
        winner: winner ? currentPlayer : false,
        draw: draw
      });
      if (winner) {
        games.delete(roomCode)
      }
    });

    socket.on("leave-room", ({ roomCode }) => {
      const cookies = socket.handshake.headers.cookie;
      const parsedCookies = cookie.parse(cookies || "");
      const sessionId = parsedCookies.sessionId;
      const room = rooms.get(roomCode)
      if (room) {
        if (room.host === sessionId) {
          rooms.delete(roomCode);
          games.delete(roomCode)
        } else {
          room.guestName = null
          room.guest = null;
          io.to(roomCode).emit("game_not_ready")
        }
      }
    })

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
      const cookies = socket.handshake.headers.cookie;
      const parsedCookies = cookie.parse(cookies || "");
      const sessionId = parsedCookies.sessionId;
      rooms.forEach((room, roomCode) => {
        if (room.host === sessionId) {
          rooms.delete(roomCode)
          games.delete(roomCode)
        }
      });
    });
  });
}

module.exports = { initSocketHandlers };