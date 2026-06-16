// assets/js/api.js — BioHAK Wellness API Client
const API_BASE = 'https://biohak-api.onrender.com/api';

class BioHAKAPI {
  constructor() {
    this.base = API_BASE;
  }

  getHeaders() {
    const token = localStorage.getItem('bh_token');
    const sessionId = this.getSessionId();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      'x-session-id': sessionId
    };
  }

  getSessionId() {
    let sid = sessionStorage.getItem('bh_session');
    if (!sid) { sid = 'sess_' + Math.random().toString(36).slice(2) + Date.now(); sessionStorage.setItem('bh_session', sid); }
    return sid;
  }

  async request(method, path, body = null) {
    try {
      const res = await fetch(`${this.base}${path}`, {
        method,
        headers: this.getHeaders(),
        ...(body ? { body: JSON.stringify(body) } : {})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err) {
      console.error(`API ${method} ${path}:`, err.message);
      throw err;
    }
  }

  // ── AUTH ──────────────────────────────────────────────────
  async register(data) { return this.request('POST', '/auth/register', data); }
  async login(email, password) { return this.request('POST', '/auth/login', { email, password }); }
  async getProfile() { return this.request('GET', '/auth/me'); }
  async updateProfile(data) { return this.request('PUT', '/auth/me', data); }
  async forgotPassword(email) { return this.request('POST', '/auth/forgot-password', { email }); }
  async resetPassword(token, password) { return this.request('POST', '/auth/reset-password', { token, password }); }
  async addAddress(data) { return this.request('POST', '/auth/addresses', data); }

  // ── PRODUCTS ──────────────────────────────────────────────
  async getProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request('GET', `/products${qs ? '?' + qs : ''}`);
  }
  async getProduct(slug) { return this.request('GET', `/products/${slug}`); }
  async getFeaturedProducts() { return this.request('GET', '/products/featured'); }
  async getProductReviews(id) { return this.request('GET', `/products/${id}/reviews`); }
  async submitReview(id, data) { return this.request('POST', `/products/${id}/reviews`, data); }

  // ── CART ──────────────────────────────────────────────────
  async getCart() { return this.request('GET', '/cart'); }
  async addToCart(product_id, quantity = 1, variant_id = null) {
    return this.request('POST', '/cart/add', { product_id, quantity, variant_id });
  }
  async updateCartItem(item_id, quantity) { return this.request('PUT', '/cart/update', { item_id, quantity }); }
  async removeFromCart(item_id) { return this.request('DELETE', `/cart/remove/${item_id}`); }
  async applyCoupon(code) { return this.request('POST', '/cart/apply-coupon', { code }); }

  // ── ORDERS ────────────────────────────────────────────────
  async createOrder(data) { return this.request('POST', '/orders', data); }
  async getOrders() { return this.request('GET', '/orders'); }
  async getOrder(orderNumber) { return this.request('GET', `/orders/${orderNumber}`); }

  // ── PAYMENTS ──────────────────────────────────────────────
  async createPaymentOrder(order_id) { return this.request('POST', '/payments/create-order', { order_id }); }
  async verifyPayment(data) { return this.request('POST', '/payments/verify', data); }
}

// Global instance
window.bhAPI = new BioHAKAPI();
