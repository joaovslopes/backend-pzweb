// middleware/auth.js
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Sem token de autenticação." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Você pode guardar todo o payload ou só o ID
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido." });
  }
};
