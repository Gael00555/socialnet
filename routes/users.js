// routes/users.js
// Rutas de perfil de usuario (protegidas con JWT)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/profile — Perfil propio
router.get('/profile', auth, userController.getMiPerfil);

// PUT /api/profile — Actualizar nombre y bio
router.put('/profile', auth, userController.updatePerfil);

// POST /api/profile/photo — Subir foto de perfil
router.post('/profile/photo', auth, upload.single('foto'), userController.updateFoto);

// GET /api/profile/:id — Perfil público de otro usuario
router.get('/profile/:id', auth, userController.getPerfilPublico);

// GET /api/users/search?q=texto — Buscar usuarios
router.get('/users/search', auth, userController.buscarUsuarios);

module.exports = router;
