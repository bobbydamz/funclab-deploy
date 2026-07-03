// assets/js/orders.js — Func Lab client-side orders (localStorage only, no backend).
const FuncOrders = {
  KEY: 'funclab_orders',

  all() { return Store.get(this.KEY, []); },

  save(list) { Store.set(this.KEY, list); },

  // customerInfo: {name, email, phone, address:{line1,line2,city,state,pincode}, notes, paymentMethod}
  create(cart, customerInfo) {
    const totals = cart.totals();
    const user = window.funcAuth ? window.funcAuth.user : null;
    const order = {
      id: Store.uid(),
      orderNumber: 'FL-' + Store.uid().toUpperCase(),
      userId: user ? user.id : null,
      guestEmail: user ? null : customerInfo.email,
      items: cart.items.map(i => ({ ...i })),
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      discount: totals.discount,
      total: totals.total,
      couponCode: totals.coupon ? totals.coupon.code : null,
      status: 'pending',
      paymentStatus: customerInfo.paymentMethod === 'cod' ? 'unpaid' : 'paid',
      paymentMethod: customerInfo.paymentMethod || 'razorpay',
      customerName: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.address,
      notes: customerInfo.notes || '',
      createdAt: new Date().toISOString()
    };
    const list = this.all();
    list.unshift(order);
    this.save(list);
    cart.clear();
    return order;
  },

  forCurrentUser() {
    const user = window.funcAuth ? window.funcAuth.user : null;
    if (!user) return [];
    return this.all().filter(o => o.userId === user.id);
  },

  updateStatus(id, field, value) {
    const list = this.all();
    const order = list.find(o => o.id === id);
    if (!order) return;
    if (field === 'status') order.status = value;
    else if (field === 'payment') order.paymentStatus = value;
    this.save(list);
  }
};

window.funcOrders = FuncOrders;
