// services/postService.js
// Lógica de negocio para publicaciones

const { Post, User } = require('../models');
const { obtenerIdsAmigos } = require('./friendshipService');
const { Op } = require('sequelize');

/**
 * Crea una nueva publicación.
 */
async function crearPublicacion(usuarioId, contenido) {
  if (!contenido || contenido.trim().length === 0) {
    throw new Error('El contenido no puede estar vacío');
  }

  const post = await Post.create({
    usuario_id: usuarioId,
    contenido: contenido.trim()
  });

  // Devolver con datos del autor
  const postConAutor = await Post.findByPk(post.id, {
    include: [{ model: User, as: 'autor', attributes: ['id', 'nombre', 'foto'] }]
  });

  return postConAutor;
}

/**
 * Obtiene el feed: publicaciones del usuario + sus amigos, orden cronológico inverso.
 */
async function obtenerFeed(usuarioId, pagina = 1, limite = 20) {
  const offset = (pagina - 1) * limite;

  // IDs de amigos + el propio usuario
  const idsAmigos = await obtenerIdsAmigos(usuarioId);
  const ids = [usuarioId, ...idsAmigos];

  const posts = await Post.findAll({
    where: {
      usuario_id: { [Op.in]: ids }
    },
    include: [
      {
        model: User,
        as: 'autor',
        attributes: ['id', 'nombre', 'foto']
      }
    ],
    order: [['fecha_creacion', 'DESC']],
    limit: limite,
    offset
  });

  return posts;
}

/**
 * Obtiene publicaciones de un usuario específico.
 */
async function obtenerPublicacionesUsuario(usuarioId, pagina = 1, limite = 20) {
  const offset = (pagina - 1) * limite;

  const posts = await Post.findAll({
    where: { usuario_id: usuarioId },
    include: [
      {
        model: User,
        as: 'autor',
        attributes: ['id', 'nombre', 'foto']
      }
    ],
    order: [['fecha_creacion', 'DESC']],
    limit: limite,
    offset
  });

  return posts;
}

/**
 * Elimina una publicación (solo el dueño puede eliminarla).
 */
async function eliminarPublicacion(postId, usuarioId) {
  const post = await Post.findOne({
    where: { id: postId, usuario_id: usuarioId }
  });

  if (!post) {
    throw new Error('Publicación no encontrada o no tienes permiso');
  }

  await post.destroy();
  return { message: 'Publicación eliminada' };
}

module.exports = { crearPublicacion, obtenerFeed, obtenerPublicacionesUsuario, eliminarPublicacion };
