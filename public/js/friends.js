// public/js/friends.js
// Módulo de amistades frontend

const Friends = {
  async enviarSolicitud(amigoId) {
    try {
      await Api.post('/friends/request', { amigoId });
      showToast('Solicitud de amistad enviada.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async aceptar(solicitudId, cardEl) {
    try {
      await Api.post('/friends/accept', { solicitudId });
      cardEl.remove();
      showToast('¡Ahora son amigos!', 'success');
      // Refrescar lista de amigos
      Friends.cargarAmigosEnSidebar();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async rechazar(solicitudId, cardEl) {
    try {
      await Api.post('/friends/reject', { solicitudId });
      cardEl.remove();
      showToast('Solicitud rechazada.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  /**
   * Carga solicitudes pendientes en el sidebar del feed.
   */
  async cargarSolicitudes() {
    try {
      const solicitudes = await Api.get('/friends/requests');
      const el = document.getElementById('friend-requests-list');

      if (solicitudes.length === 0) {
        el.innerHTML = '<p class="empty-msg">Sin solicitudes</p>';
        return;
      }

      el.innerHTML = solicitudes.map(s => Friends._renderRequestCard(s)).join('');
      Friends._bindRequestButtons(el);
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
    }
  },

  /**
   * Carga amigos en el sidebar del feed.
   */
  async cargarAmigosEnSidebar() {
    try {
      const amigos = await Api.get('/friends/list');
      const el = document.getElementById('friends-list-sidebar');

      if (amigos.length === 0) {
        el.innerHTML = '<p class="empty-msg">Aún no tenés amigos</p>';
        return;
      }

      el.innerHTML = amigos.map(a => `
        <div class="friend-chip" onclick="Profile.verPerfil(${a.id})">
          <img class="friend-chip-avatar" src="${a.foto || '/img/default-avatar.svg'}" onerror="this.src='/img/default-avatar.svg'" alt="${a.nombre}" />
          <span class="friend-chip-name">${escHtml(a.nombre)}</span>
        </div>
      `).join('');
    } catch (err) {
      console.error('Error cargando amigos en sidebar:', err);
    }
  },

  /**
   * Carga la página completa de amigos.
   */
  async cargarPaginaAmigos() {
    // Lista completa de amigos
    try {
      const amigos = await Api.get('/friends/list');
      const el = document.getElementById('full-friends-list');

      if (amigos.length === 0) {
        el.innerHTML = '<p class="empty-msg">Aún no tenés amigos. ¡Buscá personas desde el feed!</p>';
      } else {
        el.innerHTML = amigos.map(a => `
          <div class="friend-card-full" onclick="Profile.verPerfil(${a.id})">
            <img src="${a.foto || '/img/default-avatar.svg'}" onerror="this.src='/img/default-avatar.svg'" alt="${a.nombre}" />
            <span class="fname">${escHtml(a.nombre)}</span>
            ${a.bio ? `<span style="font-size:.78rem;color:var(--slate-light)">${escHtml(a.bio.substring(0,60))}</span>` : ''}
          </div>
        `).join('');
      }
    } catch (err) {
      document.getElementById('full-friends-list').innerHTML = '<p class="empty-msg">Error al cargar.</p>';
    }

    // Solicitudes pendientes completas
    try {
      const solicitudes = await Api.get('/friends/requests');
      const el = document.getElementById('full-requests-list');

      if (solicitudes.length === 0) {
        el.innerHTML = '<p class="empty-msg">No hay solicitudes pendientes.</p>';
      } else {
        el.innerHTML = solicitudes.map(s => Friends._renderRequestCard(s, true)).join('');
        Friends._bindRequestButtons(el);
      }
    } catch (err) {
      document.getElementById('full-requests-list').innerHTML = '<p class="empty-msg">Error al cargar.</p>';
    }
  },

  _renderRequestCard(s, full = false) {
    const foto = s.solicitante?.foto || '/img/default-avatar.svg';
    const nombre = s.solicitante?.nombre || 'Usuario';
    return `
      <div class="request-card" data-solicitud="${s.id}">
        <img class="request-avatar" src="${foto}" onerror="this.src='/img/default-avatar.svg'" alt="${nombre}" />
        <span class="request-name">${escHtml(nombre)}</span>
        <div class="request-actions">
          <button class="btn btn-success btn-sm btn-accept">Aceptar</button>
          <button class="btn btn-ghost btn-sm btn-reject">Rechazar</button>
        </div>
      </div>
    `;
  },

  _bindRequestButtons(container) {
    container.querySelectorAll('.request-card').forEach(card => {
      const solicitudId = card.dataset.solicitud;
      card.querySelector('.btn-accept')?.addEventListener('click', () => Friends.aceptar(solicitudId, card));
      card.querySelector('.btn-reject')?.addEventListener('click', () => Friends.rechazar(solicitudId, card));
    });
  }
};
