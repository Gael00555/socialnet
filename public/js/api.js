// public/js/api.js
// Módulo central para comunicarse con la API REST

const API_BASE = '/api';

const Api = {
  /**
   * Obtiene el token JWT almacenado en localStorage.
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Wrapper de fetch con headers de autenticación automáticos.
   * @param {string} path - Ruta relativa, ej: '/posts/feed'
   * @param {object} options - Opciones de fetch (method, body, etc.)
   * @returns {Promise<any>} - JSON de respuesta
   * @throws {Error} - Si la respuesta no es 2xx
   */
  async request(path, options = {}) {
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    // Para respuestas sin cuerpo (ej: 204)
    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}`);
    }

    return data;
  },

  get(path) {
    return this.request(path, { method: 'GET' });
  },

  post(path, body) {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  put(path, body) {
    return this.request(path, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  delete(path) {
    return this.request(path, { method: 'DELETE' });
  },

  /**
   * Upload de archivos con FormData (multipart/form-data).
   * No incluye Content-Type para que el browser lo setee con boundary.
   */
  async upload(path, formData) {
    const token = this.getToken();

    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}`);
    }

    return data;
  }
};
