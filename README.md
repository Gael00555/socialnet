# SocialNet MVP

Red social minimalista inspirada en Facebook 2004.  
Stack: Node.js + Express · PostgreSQL + Sequelize · Vanilla JS

---

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+ corriendo localmente (o en la nube)
- npm

---

## Instalación local

### 1. Clonar / descargar el proyecto

```bash
git clone <tu-repo> socialnet
cd socialnet
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus datos:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=socialnet
DB_USER=postgres
DB_PASS=tu_password_de_postgres

JWT_SECRET=una_cadena_larga_y_aleatoria_aqui
SESSION_SECRET=otra_cadena_larga_y_aleatoria

PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
```

### 4. Crear la base de datos en PostgreSQL

```bash
psql -U postgres -c "CREATE DATABASE socialnet;"
```

O desde psql interactivo:

```sql
CREATE DATABASE socialnet;
```

### 5. Inicializar tablas

```bash
npm run db:init
```

Esto crea las tablas `usuarios`, `amistades` y `publicaciones` automáticamente via Sequelize.

### 6. Iniciar el servidor

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

Abrir en el navegador: **http://localhost:3000**

---

## Estructura del proyecto

```
socialnet/
├── server.js              # Entrada principal
├── .env.example           # Plantilla de variables de entorno
├── config/
│   ├── database.js        # Configuración Sequelize / PostgreSQL
│   └── initDb.js          # Script de inicialización de BD
├── models/
│   ├── index.js           # Asociaciones entre modelos
│   ├── User.js            # Modelo usuario
│   ├── Friendship.js      # Modelo amistad/solicitud
│   └── Post.js            # Modelo publicación
├── services/
│   ├── authService.js     # Registro, login, JWT
│   ├── userService.js     # Perfil, búsqueda
│   ├── friendshipService.js # Solicitudes, amigos
│   └── postService.js     # Publicaciones, feed
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── friendshipController.js
│   └── postController.js
├── routes/
│   ├── auth.js            # /api/register, /api/login
│   ├── users.js           # /api/profile, /api/users/search
│   ├── friends.js         # /api/friends/*
│   └── posts.js           # /api/posts/*
├── middleware/
│   ├── auth.js            # Verificación JWT
│   └── upload.js          # Multer (subida de fotos)
└── public/
    ├── index.html         # SPA shell
    ├── css/main.css
    ├── js/
    │   ├── api.js         # Wrapper fetch centralizado
    │   ├── auth.js        # Login / registro
    │   ├── posts.js       # Feed y publicaciones
    │   ├── profile.js     # Perfil de usuario
    │   ├── friends.js     # Amistades
    │   ├── search.js      # Búsqueda de personas
    │   └── app.js         # Router SPA + utilidades
    ├── img/
    │   └── default-avatar.svg
    └── uploads/           # Fotos subidas por usuarios
```

---

## API REST 

Todas las rutas protegidas requieren header:
```
Authorization: Bearer <token>
```

### Autenticación 

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/register` | Crear cuenta |
| POST | `/api/login` | Iniciar sesión |

**Body register/login:**
```json
{ "nombre": "Ana García", "email": "ana@ejemplo.com", "password": "123456" }
```

**Respuesta:**
```json
{ "token": "eyJ...", "user": { "id": 1, "nombre": "Ana", "email": "...", "foto": null, "bio": null } }
```

---

### Perfil (protegido)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/profile` | Mi perfil completo |
| PUT | `/api/profile` | Actualizar nombre y bio |
| POST | `/api/profile/photo` | Subir foto (multipart) |
| GET | `/api/profile/:id` | Perfil público de otro usuario |
| GET | `/api/users/search?q=texto` | Buscar usuarios |



### Publicaciones 

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/posts` | Crear publicación |
| GET | `/api/posts/feed` | Feed cronológico (propio + amigos) |
| GET | `/api/posts/user/:userId` | Posts de un usuario |
| DELETE | `/api/posts/:id` | Eliminar publicación propia |



### Amistades 

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/friends/request` | Enviar solicitud (`{ amigoId }`) |
| POST | `/api/friends/accept` | Aceptar solicitud (`{ solicitudId }`) |
| POST | `/api/friends/reject` | Rechazar solicitud (`{ solicitudId }`) |
| GET | `/api/friends/list` | Listar amigos aceptados |
| GET | `/api/friends/requests` | Solicitudes pendientes recibidas |

## Seguridad implementada

- **Contraseñas hasheadas** con bcryptjs (10 rounds)
- **JWT** con expiración de 7 días
- **Validación** de inputs en controllers y modelos Sequelize
- **Escape de HTML** en el frontend para prevenir XSS
- **Autenticación por middleware** en todas las rutas protegidas
- **Multer** con filtro de tipo de archivo y límite de 5MB

---

## Limitaciones 

- Sin chat en tiempo real
- Sin notificaciones push
- Sin likes ni comentarios
- Sin algoritmo de recomendación
- Sin paginación infinita (solo "ver más")
- Sin verificación de email


