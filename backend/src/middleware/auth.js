const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const token = bearer.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user || user.isBanned) return res.status(403).json({ message: 'Access denied' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
