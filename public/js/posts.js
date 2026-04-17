// public/js/posts.js
// Módulo de publicaciones frontend

const Posts = {
  _pagina: 1,
  _hayMas: true,

  async crear() {
    const textarea = document.getElementById('post-content');
    const contenido = textarea.value.trim();

    if (!contenido) {
      showToast('Escribí algo antes de publicar.', 'error');
      return;
    }

    try {
      const post = await Api.post('/posts', { contenido });
      textarea.value = '';
      document.getElementById('char-count').textContent = '0 / 2000';

      // Insertar el post al tope del feed sin recargar todo
      const feedList = document.getElementById('feed-list');
      const emptyMsg = feedList.querySelector('.empty-msg');
      if (emptyMsg) emptyMsg.remove();

      const card = Posts._renderCard(post);
      feedList.insertAdjacentHTML('afterbegin', card);
      Posts._bindDeleteButtons(feedList);

      showToast('¡Publicado!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  async cargarFeed(reset = true) {
    if (reset) {
      Posts._pagina = 1;
      Posts._hayMas = true;
      document.getElementById('feed-list').innerHTML = '<p class="loading-msg">Cargando...</p>';
    }

    try {
      const posts = await Api.get(`/posts/feed?pagina=${Posts._pagina}&limite=15`);
      const feedList = document.getElementById('feed-list');

      if (reset) feedList.innerHTML = '';

      if (posts.length === 0 && reset) {
        feedList.innerHTML = '<p class="empty-msg">No hay publicaciones aún. ¡Sé el primero!</p>';
        document.getElementById('feed-load-more').classList.add('hidden');
        return;
      }

      posts.forEach(post => {
        feedList.insertAdjacentHTML('beforeend', Posts._renderCard(post));
      });

      Posts._bindDeleteButtons(feedList);

      // Mostrar/ocultar "ver más"
      if (posts.length < 15) {
        document.getElementById('feed-load-more').classList.add('hidden');
        Posts._hayMas = false;
      } else {
        document.getElementById('feed-load-more').classList.remove('hidden');
      }
    } catch (err) {
      document.getElementById('feed-list').innerHTML = `<p class="empty-msg">Error cargando el feed.</p>`;
    }
  },

  async cargarMas() {
    if (!Posts._hayMas) return;
    Posts._pagina++;
    await Posts.cargarFeed(false);
  },

  async cargarDeUsuario(userId, contenedor) {
    contenedor.innerHTML = '<p class="loading-msg">Cargando...</p>';
    try {
      const posts = await Api.get(`/posts/user/${userId}`);
      if (posts.length === 0) {
        contenedor.innerHTML = '<p class="empty-msg">Este usuario no ha publicado nada aún.</p>';
        return;
      }
      contenedor.innerHTML = posts.map(p => Posts._renderCard(p)).join('');
      Posts._bindDeleteButtons(contenedor);
    } catch (err) {
      contenedor.innerHTML = '<p class="empty-msg">Error al cargar publicaciones.</p>';
    }
  },

  async eliminar(postId, btnEl) {
    if (!confirm('¿Eliminás esta publicación?')) return;
    try {
      await Api.delete(`/posts/${postId}`);
      btnEl.closest('.post-card').remove();
      showToast('Publicación eliminada.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  /**
   * Renderiza el HTML de una card de post.
   */
  _renderCard(post) {
    const me = Auth.getUser();
    const autor = post.autor || {};
    const foto = autor.foto ? autor.foto : '/img/default-avatar.svg';
    const fecha = formatearFecha(post.fecha_creacion);
    const esPropio = me && autor.id === me.id;

    return `
      <article class="post-card" data-id="${post.id}">
        <div class="post-header">
          <img
            class="post-avatar"
            src="${foto}"
            alt="${autor.nombre}"
            onerror="this.src='/img/default-avatar.svg'"
            onclick="Profile.verPerfil(${autor.id})"
          />
          <div style="flex:1">
            <div class="post-author" onclick="Profile.verPerfil(${autor.id})">${escHtml(autor.nombre || 'Usuario')}</div>
            <div class="post-date">${fecha}</div>
          </div>
        </div>
        <p class="post-content">${escHtml(post.contenido)}</p>
        ${esPropio ? `<div class="post-footer"><button class="post-delete" data-postid="${post.id}">Eliminar</button></div>` : ''}
      </article>
    `;
  },

  _bindDeleteButtons(container) {
    container.querySelectorAll('.post-delete').forEach(btn => {
      btn.addEventListener('click', () => Posts.eliminar(btn.dataset.postid, btn));
    });
  }
};

function updateCharCount(el) {
  const count = el.value.length;
  document.getElementById('char-count').textContent = `${count} / 2000`;
}
