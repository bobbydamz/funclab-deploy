// assets/js/auth.js — BioHAK Wellness Auth Management
class BioHAKAuth {
  constructor() {
    this.user = null;
    this.token = localStorage.getItem('bh_token');
    this.init();
  }

  async init() {
    if (this.token) {
      try {
        this.user = await window.bhAPI.getProfile();
        this.updateUI();
      } catch (_) {
        this.logout(false);
      }
    }
    this.updateUI();
  }

  async login(email, password) {
    const data = await window.bhAPI.login(email, password);
    this.token = data.token;
    this.user = data.user;
    localStorage.setItem('bh_token', data.token);
    localStorage.setItem('bh_user', JSON.stringify(data.user));
    this.updateUI();
    return data;
  }

  async register(userData) {
    const data = await window.bhAPI.register(userData);
    this.token = data.token;
    this.user = data.user;
    localStorage.setItem('bh_token', data.token);
    localStorage.setItem('bh_user', JSON.stringify(data.user));
    this.updateUI();
    return data;
  }

  logout(redirect = true) {
    this.token = null;
    this.user = null;
    localStorage.removeItem('bh_token');
    localStorage.removeItem('bh_user');
    this.updateUI();
    if (redirect) window.location.href = '/index.html';
  }

  isLoggedIn() { return !!this.token && !!this.user; }
  isAdmin() { return this.user?.role === 'admin'; }

  updateUI() {
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const userGreeting = document.getElementById('userGreeting');
    const adminLink = document.getElementById('adminLink');

    if (this.isLoggedIn()) {
      if (loginLink) { loginLink.textContent = `Hi, ${this.user.first_name || 'Account'}`; loginLink.href = '/account.html'; }
      if (logoutBtn) { logoutBtn.style.display = 'inline-block'; logoutBtn.addEventListener('click', () => this.logout()); }
      if (userGreeting) userGreeting.textContent = `Welcome back, ${this.user.first_name || 'there'}!`;
      if (adminLink && this.isAdmin()) adminLink.style.display = 'inline-block';
    } else {
      if (loginLink) { loginLink.textContent = 'Log in'; loginLink.href = '/account.html'; }
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  // Guard: redirect to login if not authenticated
  requireAuth() {
    if (!this.isLoggedIn()) {
      sessionStorage.setItem('bh_redirect', window.location.href);
      window.location.href = '/account.html';
      return false;
    }
    return true;
  }

  // Guard: redirect if not admin
  requireAdmin() {
    if (!this.isAdmin()) { window.location.href = '/index.html'; return false; }
    return true;
  }
}

window.bhAuth = new BioHAKAuth();

// Handle logout buttons
document.querySelectorAll('[data-action="logout"]').forEach(btn => {
  btn.addEventListener('click', () => window.bhAuth.logout());
});
