// config/initDb.js
// Script para inicializar la base de datos (ejecutar una sola vez)

require('dotenv').config();
const sequelize = require('./database');
const User = require('../models/User');
const Friendship = require('../models/Friendship');
const Post = require('../models/Post');

async function initDb() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    console.log('🏗️  Sincronizando modelos...');
    // force: false para no borrar datos existentes
    // Cambiar a true solo en desarrollo para resetear
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    console.log('🎉 Base de datos lista');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error iniciando base de datos:', error);
    process.exit(1);
  }
}

initDb();
