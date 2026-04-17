// models/User.js
// Modelo de usuario con Sequelize

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre no puede estar vacío' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: { msg: 'Este email ya está registrado' },
    validate: {
      isEmail: { msg: 'Email inválido' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  foto: {
    type: DataTypes.STRING(500),
    defaultValue: null
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

module.exports = User;
