// routes/posts.js
// Rutas de publicaciones (protegidas con JWT)

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// POST /api/posts — Crear publicación
router.post('/posts', auth, postController.crearPost);

// GET /api/posts/feed — Feed cronológico
router.get('/posts/feed', auth, postController.getFeed);

// GET /api/posts/user/:userId — Posts de un usuario
router.get('/posts/user/:userId', auth, postController.getPostsDeUsuario);

// DELETE /api/posts/:id — Eliminar publicación propia
router.delete('/posts/:id', auth, postController.eliminarPost);

module.exports = router;
