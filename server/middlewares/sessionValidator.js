

const sessionValidator = (req, res, next) => {
  const sessionId = req.cookies?.sessionId;
  const session = sessionId && req.app.locals.sessions.get(sessionId);
  if (session && session.expiresAt > Date.now()) {
    req.session = session;
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
module.exports = { sessionValidator }

