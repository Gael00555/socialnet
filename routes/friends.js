// routes/friends.js
// Rutas del sistema de amistades (protegidas con JWT)

const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendshipController');
const auth = require('../middleware/auth');

// POST /api/friends/request — Enviar solicitud de amistad
router.post('/friends/request', auth, friendshipController.enviarSolicitud);

// POST /api/friends/accept — Aceptar solicitud
router.post('/friends/accept', auth, friendshipController.aceptarSolicitud);

// POST /api/friends/reject — Rechazar solicitud
router.post('/friends/reject', auth, friendshipController.rechazarSolicitud);

// GET /api/friends/list — Listar amigos
router.get('/friends/list', auth, friendshipController.listarAmigos);

// GET /api/friends/requests — Solicitudes pendientes recibidas
router.get('/friends/requests', auth, friendshipController.solicitudesPendientes);

module.exports = router;
