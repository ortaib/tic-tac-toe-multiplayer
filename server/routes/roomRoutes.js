const express = require('express');
const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  const router = express.Router();
  router.post('/create-room', (req, res) => {
    const { name } = req.body;
    const sessionId = req.cookies.sessionId;
    req.app.locals.rooms.forEach((room, roomCode) => {
      if(room.host === sessionId) {
        req.app.locals.rooms.delete(roomCode)
        req.app.locals.games.delete(roomCode)
      }
    })
    const roomCode = uuidv4().slice(0, 6);
    req.app.locals.rooms.set(roomCode, {
      host: sessionId,
      hostName: name,
      guest: null,
      guestName: null,
      createdAt: Date.now()
    });
    res.json({ roomCode });
  });

  router.post('/join-room', (req, res) => {
    const { name, roomCode } = req.body;
    const sessionId = req.cookies.sessionId;

    const room = req.app.locals.rooms.get(roomCode);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (room.guest) {
      return res.status(403).json({ error: 'Room is full' });
    }

    room.guest = sessionId;
    room.guestName = name
    req.app.locals.games.set(roomCode, {
      players: [room.hostName, name],
      board: Array(9).fill(null),
      currentTurn: room.hostName
    });
    if(room.guest === sessionId) {
      io.to(roomCode).emit("game_ready", { host: room.hostName});
    }
    console.log(`${name} joined room ${roomCode}. game starting`);
    res.json({ message: 'Joined successfully', roomCode });
  });
  return router
}