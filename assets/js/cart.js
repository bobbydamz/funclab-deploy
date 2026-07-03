// assets/js/cart.js — Func Lab client-side cart (localStorage only, no backend).
class FuncCart {
  constructor() {
    this.state = Store.get('funclab_cart', { items: [], couponCode: null });
    this.listeners = [];
    this.renderBadge();
  }

  save() { Store.set('funclab_cart', this.state); }

  get items() { return this.state.items; }

  get count() { return this.state.items.reduce((s, i) => s + i.qty, 0); }

  // product: {id, name, price, image, slug, variantId?}
  add(product, qty = 1) {
    const variantId = product.variantId || null;
    const existing = this.state.items.find(i => i.productId === product.id && i.variantId === variantId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.state.items.push({
        lineId: Store.uid(),
        productId: product.id,
        variantId,
        name: product.name,
        price: product.price,
        image: product.image || '',
        slug: product.slug || '',
        qty
      });
    }
    this.save();
    this.renderBadge();
    this.toast('Added to cart!');
    this.emit('add');
  }

  update(lineId, qty) {
    if (qty < 1) return this.remove(lineId);
    const item = this.state.items.find(i => i.lineId === lineId);
    if (item) { item.qty = qty; this.save(); this.renderBadge(); this.emit('update'); }
  }

  remove(lineId) {
    this.state.items = this.state.items.filter(i => i.lineId !== lineId);
    this.save();
    this.renderBadge();
    this.emit('remove');
  }

  clear() {
    this.state = { items: [], couponCode: null };
    this.save();
    this.renderBadge();
    this.emit('clear');
  }

  applyCoupon(code) {
    const coupon = window.funcCoupons ? window.funcCoupons.validate(code) : null;
    if (!coupon) return { success: false, error: 'Invalid or expired coupon code' };
    this.state.couponCode = coupon.code;
    this.save();
    this.emit('update');
    return { success: true, coupon };
  }

  removeCoupon() {
    this.state.couponCode = null;
    this.save();
    this.emit('update');
  }

  // Computes subtotal/shipping/discount/total from current items + applied coupon.
  totals() {
    const subtotal = this.state.items.reduce((s, i) => s + i.price * i.qty, 0);
    const freeShippingRemaining = Math.max(0, 1000 - subtotal);
    let shipping = this.state.items.length && subtotal < 1000 ? 99 : 0;
    let discount = 0;
    const coupon = this.state.couponCode ? (window.funcCoupons ? window.funcCoupons.get(this.state.couponCode) : null) : null;
    if (coupon) {
      if (coupon.type === 'percent') discount = subtotal * coupon.value / 100;
      else if (coupon.type === 'flat') discount = coupon.value;
      else if (coupon.type === 'shipping') shipping = 0;
      discount = Math.min(discount, subtotal);
    }
    const total = Math.max(0, subtotal - discount + shipping);
    return { subtotal, shipping, discount, total, freeShippingRemaining, coupon };
  }

  renderBadge() {
    const count = this.count;
    document.querySelectorAll('#cartCount, .cart-badge, .cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('has-items', count > 0);
    });
  }

  toast(msg, ok = true) {
    const existing = document.getElementById('bhToast');
    if (existing) existing.remove();
    const toastEl = document.createElement('div');
    toastEl.id = 'bhToast';
    toastEl.style.cssText = `position:fixed;bottom:24px;right:24px;background:${ok ? '#1a1a1a' : '#e53e3e'};color:#fff;padding:14px 20px;font-size:14px;font-weight:600;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,.2);`;
    toastEl.textContent = msg;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 3000);
  }

  on(fn) { this.listeners.push(fn); }
  emit(event) { this.listeners.forEach(fn => fn(event, this.state)); }
}

window.funcCart = new FuncCart();
