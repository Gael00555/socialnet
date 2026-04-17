// controllers/userController.js
// Controlador de perfiles de usuario

const userService = require('../services/userService');
const path = require('path');

/**
 * GET /api/profile
 * Obtiene el perfil del usuario autenticado
 */
async function getMiPerfil(req, res) {
  try {
    const user = await userService.obtenerPerfil(req.userId);
    return res.json(user);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}

/**
 * GET /api/profile/:id
 * Obtiene el perfil público de cualquier usuario
 */
async function getPerfilPublico(req, res) {
  try {
    const user = await userService.obtenerPerfilPublico(req.params.id);
    return res.json(user);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}

/**
 * PUT /api/profile
 * Actualiza nombre y/o bio del usuario autenticado
 */
async function updatePerfil(req, res) {
  try {
    const { nombre, bio } = req.body;
    const user = await userService.actualizarPerfil(req.userId, { nombre, bio });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

/**
 * POST /api/profile/photo
 * Sube y actualiza la foto de perfil
 */
async function updateFoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    // Construir la URL pública de la imagen
    const fotoPath = `/uploads/${req.file.filename}`;
    const resultado = await userService.actualizarFoto(req.userId, fotoPath);

    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/users/search?q=nombre
 * Busca usuarios por nombre o email
 */
async function buscarUsuarios(req, res) {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'La búsqueda debe tener al menos 2 caracteres' });
    }

    const users = await userService.buscarUsuarios(query, req.userId);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { getMiPerfil, getPerfilPublico, updatePerfil, updateFoto, buscarUsuarios };
