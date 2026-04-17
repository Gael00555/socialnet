// controllers/authController.js
// Controlador de autenticación (registro y login)

const authService = require('../services/authService');

/**
 * POST /api/register
 * Registra un nuevo usuario
 */
async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const resultado = await authService.registrar(nombre, email, password);
    return res.status(201).json(resultado);

  } catch (error) {
    if (error.message.includes('ya está registrado')) {
      return res.status(409).json({ error: error.message });
    }
    console.error('Error en register:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/login
 * Inicia sesión
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const resultado = await authService.login(email, password);
    return res.json(resultado);

  } catch (error) {
    if (error.message.includes('incorrectos')) {
      return res.status(401).json({ error: error.message });
    }
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { register, login };
