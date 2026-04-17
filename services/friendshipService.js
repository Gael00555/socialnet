// services/friendshipService.js
// Lógica de negocio para el sistema de amistades

const { Friendship, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Envía una solicitud de amistad.
 */
async function enviarSolicitud(usuarioId, amigoId) {
  if (usuarioId === amigoId) {
    throw new Error('No puedes enviarte una solicitud a ti mismo');
  }

  // Verificar que el destinatario existe
  const amigoExiste = await User.findByPk(amigoId);
  if (!amigoExiste) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar si ya existe una solicitud en cualquier dirección
  const existe = await Friendship.findOne({
    where: {
      [Op.or]: [
        { usuario_id: usuarioId, amigo_id: amigoId },
        { usuario_id: amigoId, amigo_id: usuarioId }
      ]
    }
  });

  if (existe) {
    if (existe.estado === 'aceptado') {
      throw new Error('Ya son amigos');
    }
    if (existe.estado === 'pendiente') {
      throw new Error('Ya existe una solicitud pendiente');
    }
    if (existe.estado === 'rechazado') {
      // Permitir reenviar si fue rechazada
      existe.estado = 'pendiente';
      existe.usuario_id = usuarioId;
      existe.amigo_id = amigoId;
      await existe.save();
      return existe;
    }
  }

  const solicitud = await Friendship.create({
    usuario_id: usuarioId,
    amigo_id: amigoId,
    estado: 'pendiente'
  });

  return solicitud;
}

/**
 * Acepta una solicitud de amistad.
 * Solo el receptor puede aceptar.
 */
async function aceptarSolicitud(solicitudId, usuarioId) {
  const solicitud = await Friendship.findOne({
    where: {
      id: solicitudId,
      amigo_id: usuarioId,
      estado: 'pendiente'
    }
  });

  if (!solicitud) {
    throw new Error('Solicitud no encontrada o no tienes permiso');
  }

  solicitud.estado = 'aceptado';
  await solicitud.save();

  return solicitud;
}

/**
 * Rechaza una solicitud de amistad.
 */
async function rechazarSolicitud(solicitudId, usuarioId) {
  const solicitud = await Friendship.findOne({
    where: {
      id: solicitudId,
      amigo_id: usuarioId,
      estado: 'pendiente'
    }
  });

  if (!solicitud) {
    throw new Error('Solicitud no encontrada o no tienes permiso');
  }

  solicitud.estado = 'rechazado';
  await solicitud.save();

  return solicitud;
}

/**
 * Obtiene la lista de amigos de un usuario (estado aceptado).
 */
async function listarAmigos(usuarioId) {
  const amistades = await Friendship.findAll({
    where: {
      [Op.or]: [
        { usuario_id: usuarioId, estado: 'aceptado' },
        { amigo_id: usuarioId, estado: 'aceptado' }
      ]
    },
    include: [
      {
        model: User,
        as: 'solicitante',
        attributes: ['id', 'nombre', 'foto', 'bio']
      },
      {
        model: User,
        as: 'receptor',
        attributes: ['id', 'nombre', 'foto', 'bio']
      }
    ]
  });

  // Extraer el amigo (el que NO es el usuario actual)
  return amistades.map(a => {
    const amigo = a.usuario_id === usuarioId ? a.receptor : a.solicitante;
    return amigo;
  });
}

/**
 * Obtiene solicitudes de amistad pendientes recibidas por el usuario.
 */
async function solicitudesPendientes(usuarioId) {
  const solicitudes = await Friendship.findAll({
    where: {
      amigo_id: usuarioId,
      estado: 'pendiente'
    },
    include: [
      {
        model: User,
        as: 'solicitante',
        attributes: ['id', 'nombre', 'foto']
      }
    ]
  });

  return solicitudes;
}

/**
 * Obtiene IDs de todos los amigos de un usuario.
 * Útil para construir el feed.
 */
async function obtenerIdsAmigos(usuarioId) {
  const amistades = await Friendship.findAll({
    where: {
      [Op.or]: [
        { usuario_id: usuarioId, estado: 'aceptado' },
        { amigo_id: usuarioId, estado: 'aceptado' }
      ]
    }
  });

  return amistades.map(a =>
    a.usuario_id === usuarioId ? a.amigo_id : a.usuario_id
  );
}

module.exports = {
  enviarSolicitud,
  aceptarSolicitud,
  rechazarSolicitud,
  listarAmigos,
  solicitudesPendientes,
  obtenerIdsAmigos
};
