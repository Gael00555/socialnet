// public/js/profile.js
// Módulo de perfil de usuario

const Profile = {
  _userId: null,  // ID del perfil que se está viendo
  _esPropio: false,

  /**
   * Carga y muestra el perfil del usuario autenticado.
   */
  async cargarMiPerfil() {
    const me = Auth.getUser();
    await Profile._cargar(me.id, true);
  },

  /**
   * Carga y muestra el perfil de otro usuario.
   */
  async verPerfil(userId) {
    const me = Auth.getUser();
    const esPropio = me && parseInt(userId) === me.id;
    App.goTo('profile');
    await Profile._cargar(userId, esPropio);
  },

  async _cargar(userId, esPropio) {
    Profile._userId = parseInt(userId);
    Profile._esPropio = esPropio;

    // Reset UI
    document.getElementById('profile-nombre').textContent = 'Cargando...';
    document.getElementById('profile-bio').textContent = '';
    document.getElementById('profile-email').textContent = '';
    document.getElementById('profile-actions').innerHTML = '';
    document.getElementById('profile-edit-form').classList.add('hidden');

    try {
      const user = await Api.get(esPropio ? '/profile' : `/profile/${userId}`);
      Profile._renderHeader(user, esPropio);
      Posts.cargarDeUsuario(userId, document.getElementById('profile-posts-list'));
    } catch (err) {
      showToast('Error al cargar el perfil.', 'error');
    }
  },

  _renderHeader(user, esPropio) {
    const foto = user.foto || '/img/default-avatar.svg';
    document.getElementById('profile-foto').src = foto;
    document.getElementById('profile-nombre').textContent = user.nombre;
    document.getElementById('profile-bio').textContent = user.bio || '';
    document.getElementById('profile-email').textContent = esPropio ? user.email : '';
    document.getElementById('profile-desde').textContent =
      user.fecha_creacion ? `Miembro desde ${formatearFecha(user.fecha_creacion)}` : '';

    // Botón de subir foto (solo propio)
    const fotoBtn = document.getElementById('profile-foto-btn');
    if (esPropio) {
      fotoBtn.classList.remove('hidden');
    } else {
      fotoBtn.classList.add('hidden');
    }

    // Acciones
    const actionsEl = document.getElementById('profile-actions');
    if (esPropio) {
      actionsEl.innerHTML = `
        <button class="btn btn-outline btn-sm" onclick="Profile.mostrarEdicion()">Editar perfil</button>
      `;
    } else {
      // Botón para enviar solicitud de amistad
      actionsEl.innerHTML = `
        <button class="btn btn-primary btn-sm" onclick="Friends.enviarSolicitud(${user.id})">
          + Agregar amigo
        </button>
      `;
    }
  },

  mostrarEdicion() {
    const me = Auth.getUser();
    document.getElementById('edit-nombre').value = document.getElementById('profile-nombre').textContent;
    document.getElementById('edit-bio').value = document.getElementById('profile-bio').textContent;
    document.getElementById('profile-edit-form').classList.remove('hidden');
    document.getElementById('edit-nombre').focus();
  },

  cancelarEdicion() {
    document.getElementById('profile-edit-form').classList.add('hidden');
  },

  async guardar() {
    const nombre = document.getElementById('edit-nombre').value.trim();
    const bio    = document.getElementById('edit-bio').value.trim();

    if (!nombre) {
      showToast('El nombre no puede estar vacío.', 'error');
      return;
    }

    try {
      const user = await Api.put('/profile', { nombre, bio });

      // Actualizar localStorage
      const stored = Auth.getUser();
      stored.nombre = user.nombre;
      stored.bio = user.bio;
      localStorage.setItem('user', JSON.stringify(stored));

      // Actualizar UI
      document.getElementById('profile-nombre').textContent = user.nombre;
      document.getElementById('profile-bio').textContent = user.bio || '';
      document.getElementById('profile-edit-form').classList.add('hidden');
      App.actualizarSidebarUsuario();

      showToast('Perfil actualizado.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async subirFoto(input) {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    try {
      const result = await Api.upload('/profile/photo', formData);

      // Actualizar imagen en la UI
      document.getElementById('profile-foto').src = result.foto + '?t=' + Date.now();

      // Actualizar localStorage
      const stored = Auth.getUser();
      stored.foto = result.foto;
      localStorage.setItem('user', JSON.stringify(stored));

      App.actualizarSidebarUsuario();
      showToast('Foto actualizada.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};
