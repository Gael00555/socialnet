// middleware/auth.js
// Middleware de autenticación con JWT

const jwt = require('jsonwebtoken');

/**
 * Verifica el token JWT en la cabecera Authorization.
 * Si es válido, agrega req.userId con el ID del usuario autenticado.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  // Formato esperado: "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_dev');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
