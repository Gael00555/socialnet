// controllers/friendshipController.js
// Controlador del sistema de amistades

const friendshipService = require('../services/friendshipService');

/**
 * POST /api/friends/request
 * Envía una solicitud de amistad
 */
async function enviarSolicitud(req, res) {
  try {
    const { amigoId } = req.body;

    if (!amigoId) {
      return res.status(400).json({ error: 'amigoId es requerido' });
    }

    const solicitud = await friendshipService.enviarSolicitud(req.userId, parseInt(amigoId));
    return res.status(201).json({ message: 'Solicitud enviada', solicitud });

  } catch (error) {
    const statusMap = {
      'Ya son amigos': 409,
      'Ya existe una solicitud': 409,
      'Usuario no encontrado': 404,
      'No puedes enviarte': 400
    };

    const status = Object.keys(statusMap).find(k => error.message.includes(k));
    return res.status(status ? statusMap[status] : 500).json({ error: error.message });
  }
}

/**
 * POST /api/friends/accept
 * Acepta una solicitud de amistad
 */
async function aceptarSolicitud(req, res) {
  try {
    const { solicitudId } = req.body;

    if (!solicitudId) {
      return res.status(400).json({ error: 'solicitudId es requerido' });
    }

    const solicitud = await friendshipService.aceptarSolicitud(parseInt(solicitudId), req.userId);
    return res.json({ message: 'Solicitud aceptada', solicitud });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

/**
 * POST /api/friends/reject
 * Rechaza una solicitud de amistad
 */
async function rechazarSolicitud(req, res) {
  try {
    const { solicitudId } = req.body;

    if (!solicitudId) {
      return res.status(400).json({ error: 'solicitudId es requerido' });
    }

    await friendshipService.rechazarSolicitud(parseInt(solicitudId), req.userId);
    return res.json({ message: 'Solicitud rechazada' });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

/**
 * GET /api/friends/list
 * Lista los amigos del usuario autenticado
 */
async function listarAmigos(req, res) {
  try {
    const amigos = await friendshipService.listarAmigos(req.userId);
    return res.json(amigos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/friends/requests
 * Solicitudes de amistad pendientes recibidas
 */
async function solicitudesPendientes(req, res) {
  try {
    const solicitudes = await friendshipService.solicitudesPendientes(req.userId);
    return res.json(solicitudes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  enviarSolicitud,
  aceptarSolicitud,
  rechazarSolicitud,
  listarAmigos,
  solicitudesPendientes
};
