// assets/js/coupons.js — demo coupon codes, validated purely client-side.
const FuncCoupons = {
  KEY: 'funclab_coupons',

  seedIfEmpty() {
    if (Store.get(this.KEY, null)) return;
    Store.set(this.KEY, [
      { code: 'WELCOME10', type: 'percent', value: 10, active: true },
      { code: 'FLAT200', type: 'flat', value: 200, active: true },
      { code: 'FREESHIP', type: 'shipping', value: 0, active: true }
    ]);
  },

  all() { return Store.get(this.KEY, []); },

  get(code) {
    if (!code) return null;
    return this.all().find(c => c.code === code.toUpperCase() && c.active) || null;
  },

  validate(code) { return this.get(code); },

  create(coupon) {
    const list = this.all();
    list.push({ ...coupon, code: coupon.code.toUpperCase(), active: true });
    Store.set(this.KEY, list);
  },

  deactivate(code) {
    const list = this.all();
    const c = list.find(c => c.code === code);
    if (c) { c.active = false; Store.set(this.KEY, list); }
  }
};
FuncCoupons.seedIfEmpty();
window.funcCoupons = FuncCoupons;
