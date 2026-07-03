// assets/js/auth.js — Func Lab client-side accounts (localStorage only, no backend).
// NOTE: this is a demo/MVP simulation, not real security — passwords are stored in
// localStorage without server-side hashing and are readable via devtools. Do not reuse
// this for real customer accounts without a real backend.
class FuncAuth {
  constructor() {
    this.sessionId = Store.get('funclab_session', null);
    this.updateUI();
  }

  users() { return Store.get('funclab_users', []); }
  saveUsers(list) { Store.set('funclab_users', list); }

  get user() {
    if (!this.sessionId) return null;
    return this.users().find(u => u.id === this.sessionId) || null;
  }

  isLoggedIn() { return !!this.user; }
  isAdmin() { return this.user?.role === 'admin'; }

  register({ firstName, lastName, email, phone, password }) {
    const users = this.users();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    const user = {
      id: Store.uid(),
      firstName, lastName,
      name: `${firstName} ${lastName || ''}`.trim(),
      email, phone: phone || '',
      password,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    this.saveUsers(users);
    this.sessionId = user.id;
    Store.set('funclab_session', this.sessionId);
    this.updateUI();
    return user;
  }

  login(email, password) {
    const user = this.users().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) throw new Error('Invalid email or password');
    this.sessionId = user.id;
    Store.set('funclab_session', this.sessionId);
    this.updateUI();
    return user;
  }

  logout(redirect = false) {
    this.sessionId = null;
    Store.set('funclab_session', null);
    this.updateUI();
    if (redirect) window.location.href = '/index.html';
  }

  updateProfile({ name, phone }) {
    const users = this.users();
    const user = users.find(u => u.id === this.sessionId);
    if (!user) return;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    this.saveUsers(users);
    this.updateUI();
  }

  changePassword(oldPassword, newPassword) {
    const users = this.users();
    const user = users.find(u => u.id === this.sessionId);
    if (!user) throw new Error('Not logged in');
    if (user.password !== oldPassword) throw new Error('Current password is incorrect');
    user.password = newPassword;
    this.saveUsers(users);
  }

  updateUI() {
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const userGreeting = document.getElementById('userGreeting');
    const adminLink = document.getElementById('adminLink');
    const u = this.user;

    if (u) {
      if (loginLink) { loginLink.textContent = `Hi, ${u.firstName || u.name.split(' ')[0]}`; loginLink.href = '/account.html'; }
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      if (userGreeting) userGreeting.textContent = `Welcome back, ${u.firstName || u.name.split(' ')[0]}!`;
      if (adminLink) adminLink.style.display = this.isAdmin() ? 'inline-block' : 'none';
    } else {
      if (loginLink) { loginLink.textContent = 'Log in'; loginLink.href = '/account.html'; }
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  // Guard used by features that only make sense for a logged-in user (e.g. wishlist).
  requireAuth() {
    if (!this.isLoggedIn()) {
      sessionStorage.setItem('funclab_redirect_after_login', window.location.pathname);
      window.location.href = '/account.html';
      return false;
    }
    return true;
  }
}

window.funcAuth = new FuncAuth();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', () => window.funcAuth.logout(true));
  });
});
