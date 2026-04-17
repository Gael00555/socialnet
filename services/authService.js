// services/authService.js
// Lógica de negocio para autenticación

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_dev';
const JWT_EXPIRES = '7d'; // Token dura 7 días

/**
 * Registra un nuevo usuario.
 * @param {string} nombre
 * @param {string} email
 * @param {string} password - En texto plano, se hashea aquí
 * @returns {object} { user, token }
 */
async function registrar(nombre, email, password) {
  // Verificar si el email ya existe
  const existe = await User.findOne({ where: { email } });
  if (existe) {
    throw new Error('El email ya está registrado');
  }

  // Hashear contraseña (10 rounds es suficiente para MVP)
  const passwordHash = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = await User.create({ nombre, email, password: passwordHash });

  // Generar token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      foto: user.foto,
      bio: user.bio
    }
  };
}

/**
 * Inicia sesión con email y password.
 * @returns {object} { user, token }
 */
async function login(email, password) {
  // Buscar usuario por email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Email o contraseña incorrectos');
  }

  // Comparar contraseña
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Email o contraseña incorrectos');
  }

  // Generar token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      foto: user.foto,
      bio: user.bio
    }
  };
}

module.exports = { registrar, login };
