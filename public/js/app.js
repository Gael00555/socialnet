// public/js/app.js
// Router principal y utilidades globales de la SPA

const PAGES = ['login', 'register', 'feed', 'profile', 'friends'];
const AUTH_PAGES = ['feed', 'profile', 'friends'];

const App = {
  /**
   * Navega a una página (sección) de la SPA.
   * Controla qué páginas requieren autenticación.
   */
  goTo(page) {
    // Si la página requiere auth y no hay sesión, redirigir a login
    if (AUTH_PAGES.includes(page) && !Auth.isLoggedIn()) {
      App._showPage('login');
      return;
    }

    App._showPage(page);

    // Acciones específicas por página
    if (page === 'feed') {
      Posts.cargarFeed();
      Friends.cargarSolicitudes();
      Friends.cargarAmigosEnSidebar();
      App.actualizarSidebarUsuario();
    } else if (page === 'profile') {
      Profile.cargarMiPerfil();
    } else if (page === 'friends') {
      Friends.cargarPaginaAmigos();
    }
  },

  _showPage(page) {
    // Ocultar todas las páginas
    PAGES.forEach(p => {
      document.getElementById(`page-${p}`)?.classList.add('hidden');
    });

    // Mostrar la seleccionada
    document.getElementById(`page-${page}`)?.classList.remove('hidden');

    // Mostrar/ocultar navbar
    const navbar = document.getElementById('navbar');
    if (AUTH_PAGES.includes(page)) {
      navbar.classList.remove('hidden');
    } else {
      navbar.classList.add('hidden');
    }

    // Scroll al tope
    window.scrollTo(0, 0);
  },

  logout() {
    Auth.logout();
    App.goTo('login');
    showToast('Sesión cerrada.', 'success');
  },

  /**
   * Actualiza el widget de usuario en el sidebar del feed.
   */
  actualizarSidebarUsuario() {
    const me = Auth.getUser();
    if (!me) return;

    const el = document.getElementById('sidebar-user');
    if (!el) return;

    const foto = me.foto || '/img/default-avatar.svg';
    el.innerHTML = `
      <div class="sidebar-user">
        <img class="sidebar-avatar" src="${foto}" onerror="this.src='/img/default-avatar.svg'" alt="${me.nombre}" />
        <div class="sidebar-user-name">${escHtml(me.nombre)}</div>
        <a href="#" class="sidebar-user-link" onclick="App.goTo('profile')">Ver mi perfil</a>
      </div>
    `;
  }
};

// ── Helpers globales ────────────────────────────────────────────

/**
 * Muestra un toast de notificación temporal.
 */
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

/**
 * Escapa HTML para evitar XSS en contenido de usuarios.
 */
function escHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formatea una fecha ISO a texto legible.
 */
function formatearFecha(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const ahora = new Date();
  const diff = (ahora - d) / 1000; // segundos

  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} hs`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} días`;

  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Toggle del menú móvil del navbar.
 */
function toggleMobileMenu() {
  const menu = document.getElementById('navMobileMenu');
  menu.classList.toggle('hidden');
}

// ── Inicialización ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (Auth.isLoggedIn()) {
    App.goTo('feed');
  } else {
    App.goTo('login');
  }
});
