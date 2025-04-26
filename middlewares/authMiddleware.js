// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.protectRoute = (req, res, next) => {
  // Pode-se esperar que o token venha no header Authorization no formato: "Bearer token"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Acesso não autorizado." });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Pode-se adicionar o usuário decodificado ao objeto req para uso posterior:
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido." });
  }
};
