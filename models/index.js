// models/index.js
// Punto central de modelos y sus asociaciones

const sequelize = require('../config/database');
const User = require('./User');
const Friendship = require('./Friendship');
const Post = require('./Post');

// --- Asociaciones ---

// Un usuario tiene muchas publicaciones
User.hasMany(Post, { foreignKey: 'usuario_id', as: 'publicaciones' });
Post.belongsTo(User, { foreignKey: 'usuario_id', as: 'autor' });

// Amistades: un usuario tiene muchas solicitudes enviadas y recibidas
User.hasMany(Friendship, { foreignKey: 'usuario_id', as: 'solicitudesEnviadas' });
User.hasMany(Friendship, { foreignKey: 'amigo_id', as: 'solicitudesRecibidas' });
Friendship.belongsTo(User, { foreignKey: 'usuario_id', as: 'solicitante' });
Friendship.belongsTo(User, { foreignKey: 'amigo_id', as: 'receptor' });

module.exports = { sequelize, User, Friendship, Post };
