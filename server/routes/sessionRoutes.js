const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.post('/create-session', (req, res) => {
  const { params: { name } } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const sessionId = uuidv4();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  req.app.locals.sessions.set(sessionId, { name, expiresAt });
  res.cookie('sessionId', sessionId, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  });
  console.log("created session:" + sessionId)
  res.json({ sessionId, name });
});

router.get('/login_from_cookie', (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = req.app.locals.sessions.get(sessionId);
  if (!session || session.expiresAt < Date.now()) {
    return res.json()
  }
  console.log("Connecting use via cookie:" + sessionId)
  return res.json({ name: session.name });
});

module.exports = router;
