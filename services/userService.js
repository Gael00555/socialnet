// services/userService.js
// Lógica de negocio para perfiles de usuario

const { User } = require('../models');

/**
 * Obtiene el perfil de un usuario por ID.
 * Excluye la contraseña del resultado.
 */
async function obtenerPerfil(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'nombre', 'email', 'foto', 'bio', 'fecha_creacion']
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return user;
}

/**
 * Obtiene el perfil público de cualquier usuario (para ver perfil ajeno).
 */
async function obtenerPerfilPublico(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'nombre', 'foto', 'bio', 'fecha_creacion']
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return user;
}

/**
 * Actualiza los datos del perfil.
 * Solo permite actualizar nombre y bio (la foto se actualiza por separado).
 */
async function actualizarPerfil(userId, { nombre, bio }) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (nombre) user.nombre = nombre;
  if (bio !== undefined) user.bio = bio;

  await user.save();

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    foto: user.foto,
    bio: user.bio
  };
}

/**
 * Actualiza la foto de perfil.
 * @param {string} fotoPath - Ruta relativa al archivo subido
 */
async function actualizarFoto(userId, fotoPath) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  user.foto = fotoPath;
  await user.save();

  return { foto: user.foto };
}

/**
 * Busca usuarios por nombre o email (para agregar amigos).
 */
async function buscarUsuarios(query, currentUserId) {
  const { Op } = require('sequelize');

  const users = await User.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } }
          ]
        },
        { id: { [Op.ne]: currentUserId } } // Excluir el usuario actual
      ]
    },
    attributes: ['id', 'nombre', 'email', 'foto'],
    limit: 20
  });

  return users;
}

module.exports = { obtenerPerfil, obtenerPerfilPublico, actualizarPerfil, actualizarFoto, buscarUsuarios };
