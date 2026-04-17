// public/js/search.js
// Módulo de búsqueda de usuarios

const Search = {
  _timer: null,

  onKeyUp(event) {
    // Debounce: esperar 400ms después de que el usuario deja de escribir
    clearTimeout(Search._timer);
    if (event.key === 'Enter') {
      Search.buscar();
      return;
    }
    const q = document.getElementById('search-input').value.trim();
    if (q.length < 2) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }
    Search._timer = setTimeout(Search.buscar, 400);
  },

  async buscar() {
    const q = document.getElementById('search-input').value.trim();
    const resultsEl = document.getElementById('search-results');

    if (q.length < 2) {
      resultsEl.innerHTML = '<p class="empty-msg">Escribí al menos 2 caracteres.</p>';
      return;
    }

    try {
      const users = await Api.get(`/users/search?q=${encodeURIComponent(q)}`);

      if (users.length === 0) {
        resultsEl.innerHTML = '<p class="empty-msg">Sin resultados.</p>';
        return;
      }

      resultsEl.innerHTML = users.map(u => `
        <div class="search-result-item">
          <img src="${u.foto || '/img/default-avatar.svg'}"
               onerror="this.src='/img/default-avatar.svg'"
               alt="${u.nombre}" />
          <span class="search-result-name">${escHtml(u.nombre)}</span>
          <button class="btn btn-sm btn-outline" onclick="Friends.enviarSolicitud(${u.id})">+ Amigo</button>
        </div>
      `).join('');
    } catch (err) {
      resultsEl.innerHTML = `<p class="empty-msg">Error: ${err.message}</p>`;
    }
  }
};
