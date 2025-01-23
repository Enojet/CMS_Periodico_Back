const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Adjunta el usuario verificado al request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
