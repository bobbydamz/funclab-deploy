# The Func. Lab — Backend API

Flask + SQLite backend for The Func. Lab e-commerce store.

## Setup & Run

```bash
# 1. Install dependencies
pip install Flask PyJWT

# 2. Start the server
python app.py
# API runs at http://localhost:5000
```

## Demo Credentials
| Role     | Email                       | Password  |
|----------|-----------------------------|-----------|
| Admin    | admin@thefunclab.com        | admin123  |
| Customer | customer@demo.com           | demo123   |

## Key Endpoints

| Method | Endpoint                          | Auth     | Description              |
|--------|-----------------------------------|----------|--------------------------|
| GET    | /api/health                       | —        | Health check             |
| GET    | /api/products/                    | —        | List / filter products   |
| GET    | /api/products/<slug>              | —        | Product detail + reviews |
| GET    | /api/products/categories          | —        | All categories           |
| POST   | /api/auth/register                | —        | Register                 |
| POST   | /api/auth/login                   | —        | Login → JWT token        |
| GET    | /api/auth/me                      | JWT      | My profile               |
| GET    | /api/cart/                        | Optional | View cart                |
| POST   | /api/cart/add                     | Optional | Add to cart              |
| POST   | /api/cart/coupon                  | Optional | Apply coupon             |
| POST   | /api/orders/checkout              | Optional | Place order              |
| GET    | /api/orders/                      | JWT      | My orders                |
| GET    | /api/admin/dashboard              | Admin    | Full dashboard stats     |
| GET    | /api/admin/inventory              | Admin    | Stock management         |
| GET    | /api/orders/admin/all             | Admin    | All orders               |

## Coupon Codes
`FUNC10` · `FUNC20` · `FLAT100` · `WELCOME` · `PROTEIN26`

## Connecting to Frontend
Add this to your HTML pages to use the API:
```javascript
const API = 'http://localhost:5000';

// Add to cart
fetch(`${API}/api/cart/add`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include',
  body: JSON.stringify({product_id: 1, quantity: 1})
});
```
