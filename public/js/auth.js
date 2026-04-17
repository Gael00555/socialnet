// public/js/auth.js
// Módulo de autenticación frontend

const Auth = {
  async login() {
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl    = document.getElementById('login-error');

    errEl.classList.add('hidden');

    if (!email || !password) {
      errEl.textContent = 'Completá todos los campos.';
      errEl.classList.remove('hidden');
      return;
    }

    try {
      const data = await Api.post('/login', { email, password });
      Auth._saveSession(data);
      App.goTo('feed');
      Posts.cargarFeed();
      Friends.cargarSolicitudes();
      Friends.cargarAmigosEnSidebar();
      App.actualizarSidebarUsuario();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  },

  async register() {
    const nombre   = document.getElementById('register-nombre').value.trim();
    const email    = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const errEl    = document.getElementById('register-error');

    errEl.classList.add('hidden');

    if (!nombre || !email || !password) {
      errEl.textContent = 'Completá todos los campos.';
      errEl.classList.remove('hidden');
      return;
    }

    if (password.length < 6) {
      errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      errEl.classList.remove('hidden');
      return;
    }

    try {
      const data = await Api.post('/register', { nombre, email, password });
      Auth._saveSession(data);
      App.goTo('feed');
      Posts.cargarFeed();
      App.actualizarSidebarUsuario();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    }
  },

  /**
   * Guarda token y datos de usuario en localStorage.
   */
  _saveSession({ token, user }) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Devuelve el usuario de sesión local o null.
   */
  getUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Indica si hay sesión activa.
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Permitir Enter en campos de login/registro
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') Auth.login();
  });
  document.getElementById('register-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') Auth.register();
  });
});
