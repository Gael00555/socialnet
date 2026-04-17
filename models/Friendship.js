// models/Friendship.js
// Modelo de amistad/solicitud entre usuarios

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Friendship = sequelize.define('Friendship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // quien envía la solicitud
  },
  amigo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // quien recibe la solicitud
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aceptado', 'rechazado'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'amistades',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  indexes: [
    {
      // Un par de usuarios solo puede tener una solicitud
      unique: true,
      fields: ['usuario_id', 'amigo_id']
    }
  ]
});

module.exports = Friendship;
