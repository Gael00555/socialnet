// server.js
// Punto de entrada principal del servidor

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globales ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas y frontend)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Rutas API ──────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const friendRoutes = require('./routes/friends');
const postRoutes = require('./routes/posts');

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', friendRoutes);
app.use('/api', postRoutes);

// ─── Ruta catch-all: devuelve index.html para el SPA ───────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Error handler global ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ─── Conexión a BD y arranque ───────────────────────────────────────────────
const { sequelize } = require('./models');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL');

    // sync sin force para no perder datos en reinicios
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
}

start();
