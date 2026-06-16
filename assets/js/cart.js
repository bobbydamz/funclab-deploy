// assets/js/cart.js — BioHAK Wellness Cart Management
class BioHAKCart {
  constructor() {
    this.cart = { items: [], subtotal: '0.00', shipping: '0.00', total: '0.00' };
    this.listeners = [];
    this.init();
  }

  async init() {
    try {
      this.cart = await window.bhAPI.getCart();
      this.updateUI();
    } catch (err) {
      // Use localStorage fallback if API unavailable
      this.loadLocal();
    }
  }

  // ── PERSIST LOCALLY (fallback) ───────────────────────────
  saveLocal() { localStorage.setItem('bh_cart', JSON.stringify(this.cart)); }
  loadLocal() {
    try { this.cart = JSON.parse(localStorage.getItem('bh_cart')) || this.cart; } catch(_) {}
    this.updateUI();
  }

  // ── CORE ACTIONS ─────────────────────────────────────────
  async add(productId, quantity = 1, variantId = null, productData = null) {
    try {
      this.cart = await window.bhAPI.addToCart(productId, quantity, variantId);
      this.updateUI();
      this.showToast('Added to cart!');
      this.triggerListeners('add');
    } catch (err) {
      // Fallback: local cart
      if (productData) {
        const existing = this.cart.items.find(i => i.product_id === productId);
        if (existing) existing.quantity += quantity;
        else this.cart.items.push({ id: Date.now().toString(), product_id: productId, quantity, price: productData.price, name: productData.name, image_url: productData.image_url });
        this.recalcLocal();
        this.saveLocal();
        this.updateUI();
        this.showToast('Added to cart!');
      }
    }
  }

  async update(itemId, quantity) {
    if (quantity < 1) return this.remove(itemId);
    try {
      this.cart = await window.bhAPI.updateCartItem(itemId, quantity);
      this.updateUI();
    } catch (_) {
      const item = this.cart.items.find(i => i.id === itemId);
      if (item) { item.quantity = quantity; this.recalcLocal(); this.saveLocal(); this.updateUI(); }
    }
  }

  async remove(itemId) {
    try {
      this.cart = await window.bhAPI.removeFromCart(itemId);
      this.updateUI();
      this.showToast('Item removed');
    } catch (_) {
      this.cart.items = this.cart.items.filter(i => i.id !== itemId);
      this.recalcLocal(); this.saveLocal(); this.updateUI();
      this.showToast('Item removed');
    }
  }

  async applyCoupon(code) {
    try {
      this.cart = await window.bhAPI.applyCoupon(code);
      this.updateUI();
      return { success: true, cart: this.cart };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  recalcLocal() {
    const subtotal = this.cart.items.reduce((s, i) => s + (parseFloat(i.price) * i.quantity), 0);
    const shipping = subtotal >= 1000 ? 0 : 99;
    this.cart.subtotal = subtotal.toFixed(2);
    this.cart.shipping = shipping.toFixed(2);
    this.cart.total = (subtotal + shipping).toFixed(2);
    this.cart.free_shipping_remaining = subtotal >= 1000 ? 0 : (1000 - subtotal).toFixed(2);
  }

  // ── UI UPDATES ───────────────────────────────────────────
  updateUI() {
    const count = this.cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;
    
    // Update cart badge
    document.querySelectorAll('.cart-count, #cartCount, .cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });

    // Update cart totals if on cart page
    this.updateCartPage();
    this.triggerListeners('update');
  }

  updateCartPage() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    if (!this.cart.items?.length) {
      cartContainer.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:64px;height:64px;color:#ccc;margin:0 auto 20px;display:block;">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Your cart is empty</p>
          <a href="/all-products.html" class="btn-primary">Continue Shopping</a>
        </div>`;
      return;
    }

    cartContainer.innerHTML = this.cart.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <a href="/${item.slug || '#'}.html">
            <img src="${item.image_url || '/product-whey-protein.png'}" alt="${item.name}" loading="lazy">
          </a>
        </div>
        <div class="cart-item-info">
          <h3 class="cart-item-name">${item.name}</h3>
          ${item.variant_name ? `<p class="cart-item-variant">${item.variant_name}</p>` : ''}
          <p class="cart-item-price">₹${parseFloat(item.price).toFixed(2)}</p>
        </div>
        <div class="cart-item-qty">
          <button onclick="bhCart.update('${item.id}', ${item.quantity - 1})" class="qty-btn">−</button>
          <span class="qty-val">${item.quantity}</span>
          <button onclick="bhCart.update('${item.id}', ${item.quantity + 1})" class="qty-btn">+</button>
        </div>
        <div class="cart-item-total">₹${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
        <button onclick="bhCart.remove('${item.id}')" class="cart-remove" aria-label="Remove">×</button>
      </div>`).join('');

    // Update summary
    document.getElementById('cartSubtotal') && (document.getElementById('cartSubtotal').textContent = `₹${this.cart.subtotal}`);
    document.getElementById('cartShipping') && (document.getElementById('cartShipping').textContent = parseFloat(this.cart.shipping) === 0 ? 'FREE' : `₹${this.cart.shipping}`);
    document.getElementById('cartTotal') && (document.getElementById('cartTotal').textContent = `₹${this.cart.total}`);
    
    if (this.cart.free_shipping_remaining > 0) {
      const el = document.getElementById('freeShippingBar');
      if (el) el.innerHTML = `Add ₹${this.cart.free_shipping_remaining} more for <strong>free shipping!</strong>`;
    }
  }

  // ── TOAST NOTIFICATIONS ──────────────────────────────────
  showToast(msg, type = 'success') {
    const existing = document.getElementById('bhToast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'bhToast';
    toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:${type==='error'?'#e53e3e':'#1a1a1a'};color:#fff;padding:14px 20px;font-size:14px;font-weight:600;z-index:99999;animation:slideIn .3s ease;box-shadow:0 8px 24px rgba(0,0,0,.2);`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ── EVENT LISTENERS ──────────────────────────────────────
  on(fn) { this.listeners.push(fn); }
  triggerListeners(event) { this.listeners.forEach(fn => fn(event, this.cart)); }

  get count() { return this.cart.items?.reduce((s, i) => s + i.quantity, 0) || 0; }
  get total() { return this.cart.total; }
}

// Global instance
window.bhCart = new BioHAKCart();

// Add CSS for toast animation
const style = document.createElement('style');
style.textContent = `@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`;
document.head.appendChild(style);
