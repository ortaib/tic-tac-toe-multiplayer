const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const sessionRoutes = require('./routes/sessionRoutes');
const { initSocketHandlers } = require('./sockets/socketHandlers')
const { sessionValidator } = require('./middlewares/sessionValidator')



const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

const roomRoutes = require('./routes/roomRoutes')(io);

const sessions = new Map();
const rooms = new Map();
const games = new Map();



app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());

app.locals.sessions = sessions;
app.locals.rooms = rooms;
app.locals.games = games;

app.use(sessionRoutes);
app.use(sessionValidator)
app.use(roomRoutes);

initSocketHandlers(io, sessions, rooms, games);

setInterval(() => {
  const now = Date.now();
  sessions.forEach((session, id) => {
    if (session.expiresAt < now) {
      sessions.delete(id);
    }
  })
}, 60 * 60 * 1000);

server.listen(3001, () => {
  console.log("Server running on port 3001!");
})
