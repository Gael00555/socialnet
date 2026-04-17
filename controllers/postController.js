// controllers/postController.js
// Controlador de publicaciones

const postService = require('../services/postService');

/**
 * POST /api/posts
 * Crea una nueva publicación
 */
async function crearPost(req, res) {
  try {
    const { contenido } = req.body;

    if (!contenido) {
      return res.status(400).json({ error: 'El contenido es requerido' });
    }

    const post = await postService.crearPublicacion(req.userId, contenido);
    return res.status(201).json(post);

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

/**
 * GET /api/posts/feed
 * Feed cronológico: publicaciones propias + amigos
 */
async function getFeed(req, res) {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = Math.min(parseInt(req.query.limite) || 20, 50); // máximo 50

    const posts = await postService.obtenerFeed(req.userId, pagina, limite);
    return res.json(posts);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/posts/user/:userId
 * Publicaciones de un usuario específico
 */
async function getPostsDeUsuario(req, res) {
  try {
    const { userId } = req.params;
    const pagina = parseInt(req.query.pagina) || 1;

    const posts = await postService.obtenerPublicacionesUsuario(parseInt(userId), pagina);
    return res.json(posts);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE /api/posts/:id
 * Elimina una publicación propia
 */
async function eliminarPost(req, res) {
  try {
    const resultado = await postService.eliminarPublicacion(parseInt(req.params.id), req.userId);
    return res.json(resultado);

  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { crearPost, getFeed, getPostsDeUsuario, eliminarPost };
