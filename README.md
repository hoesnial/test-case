# MiniShop - Product Catalog & Shopping Cart

Full-stack e-commerce application built for the Roketin Fullstack Engineer case study.

## Overview

MiniShop is a Product Catalog and Shopping Cart application featuring:
- Product browsing with search and category filtering
- Shopping cart with localStorage persistence
- Secure checkout with concurrency-safe stock management
- Admin panel for product and order management

## Tech Stack

### Backend
- **Laravel 11** (PHP 8.2+) - REST API
- **PostgreSQL 15+** - Primary database (with SQLite fallback for local review)
- **Composer** - Dependency management

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Why This Stack?

**Laravel**: Fast CRUD scaffolding, excellent ORM (Eloquent), built-in validation, and native support for database transactions with row-level locking needed for the checkout concurrency requirements.

**Next.js + TypeScript**: Modern React framework with file-based routing, built-in TypeScript support, and excellent developer experience. TypeScript catches API contract mismatches early.

**PostgreSQL**: ACID-compliant database with row-level locking (`SELECT ... FOR UPDATE`) required for preventing race conditions during checkout when multiple customers purchase the last item simultaneously.

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- PostgreSQL 15+ OR SQLite (with php-sqlite3 extension)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd minishop
```

### 2. Backend Setup (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Configuration

**Option A: SQLite (Recommended for local development)**

```bash
# Install SQLite PDO driver if not already installed
sudo apt install php-sqlite3  # Ubuntu/Debian
# or
brew install php@8.2          # macOS (includes SQLite)

# The database file already exists at database/database.sqlite
# Update .env to use SQLite:
```

In `backend/.env`, set:
```env
DB_CONNECTION=sqlite
# Comment out PostgreSQL settings
```

**Option B: PostgreSQL (Production-like)**

1. Sign up at [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Create a new PostgreSQL database
3. Update `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=your-actual-host.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=your-username
DB_PASSWORD=your-secure-password
```

### 4. Run Migrations and Seed Data

```bash
# Run database migrations and seed dummy data
php artisan migrate:fresh --seed

# This creates:
# - 4 product categories (Electronics, Clothing, Home & Living, Sports)
# - 12 dummy products with varied stock levels
```

### 5. Start Laravel Backend

```bash
# Start development server on port 8000
php artisan serve

# Backend API will be available at: http://localhost:8000
```

### 6. Frontend Setup (Next.js)

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ADMIN_TOKEN=dev-secret-token-12345
EOF

# Start development server
npm run dev

# Frontend will be available at: http://localhost:3000
```

## API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List all categories |
| GET | `/products` | List products (supports search, filter, pagination) |
| GET | `/products/{id}` | Get product details |
| POST | `/orders` | Create order (checkout) |
| GET | `/orders/{id}` | Get order details |

**Product List Query Parameters:**
- `search` - Search by product name (partial match)
- `category_id` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example:**
```bash
curl "http://localhost:8000/api/v1/products?search=wireless&category_id=1&page=1&limit=12"
```

### Admin Endpoints (Require Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/products` | Create product |
| PUT | `/admin/products/{id}` | Update product |
| DELETE | `/admin/products/{id}` | Delete product (soft delete) |
| GET | `/admin/orders` | List all orders |

**Authentication:**
Include Bearer token in request header:
```bash
curl -H "Authorization: Bearer dev-secret-token-12345" \
  http://localhost:8000/api/v1/admin/products
```

### Checkout Flow

```bash
# Create an order
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-key-123" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "081234567890",
    "shipping_address": "123 Main St",
    "shipping_city": "Jakarta",
    "shipping_postal_code": "12345",
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 3, "quantity": 1}
    ]
  }'
```

## Environment Variables

### Backend (`backend/.env`)

```env
# App
APP_NAME=MiniShop
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (choose one)
DB_CONNECTION=sqlite  # or pgsql
DB_HOST=your-db-host.com
DB_PORT=5432
DB_DATABASE=minishop
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Admin Authentication
ADMIN_TOKEN=dev-secret-token-12345

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Admin Authentication (for admin panel)
NEXT_PUBLIC_ADMIN_TOKEN=dev-secret-token-12345
```

## Project Structure

```
minishop/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # API controllers
│   │   │   └── Middleware/     # AdminTokenMiddleware
│   │   ├── Models/             # Eloquent models
│   │   └── Services/           # OrderService (checkout logic)
│   ├── database/
│   │   ├── migrations/         # Database schema
│   │   └── seeders/            # Dummy data
│   └── routes/api.php          # API routes
│
├── frontend/            # Next.js app
│   ├── app/             # App Router pages
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── cart-context.tsx   # Cart state management
│   └── components/             # React components
│
└── doc/                 # Case study documentation
```

## Key Features

### 1. Product Catalog
- Browse products by category
- Search products by name
- Pagination (12 items per page)
- Product detail view with stock information

### 2. Shopping Cart
- Add/update/remove items
- Client-side state with localStorage persistence (survives page refresh)
- Automatic total calculation
- Stock validation (prevents adding more than available)

### 3. Checkout with Concurrency Safety
- **Lock ordering**: Items sorted by product_id before locking to prevent deadlocks
- **Row-level locks**: `lockForUpdate()` ensures atomic stock verification
- **Idempotency**: Duplicate requests with same key return existing order
- **Transaction isolation**: All-or-nothing commits with automatic rollback
- **Stock verification**: Prevents overselling when multiple customers checkout simultaneously

### 4. Admin Panel
- Product management (CRUD operations)
- Order list and details
- Bearer token authentication

## Testing

### Manual Testing

1. **Test Backend API:**
```bash
# List products
curl http://localhost:8000/api/v1/products

# Get product detail
curl http://localhost:8000/api/v1/products/1

# List categories
curl http://localhost:8000/api/v1/categories
```

2. **Test Checkout Flow:**
- Add products to cart (via API or frontend)
- Submit checkout
- Verify order was created
- Check that product stock was decremented

3. **Test Edge Cases:**
- Try adding quantity > available stock (should be prevented)
- Try checking out with same idempotency key twice (should return same order)
- Try accessing admin endpoints without token (should return 401)

### Concurrency Testing

Test that only one customer can purchase the last item:

```bash
# Terminal 1
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Customer1","customer_email":"c1@test.com",
       "shipping_address":"Addr1","items":[{"product_id":5,"quantity":2}]}' &

# Terminal 2 (run immediately)
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Customer2","customer_email":"c2@test.com",
       "shipping_address":"Addr2","items":[{"product_id":5,"quantity":2}]}' &

# Result: One succeeds (201), one fails with "Insufficient stock" (409)
```

## Known Limitations

- **Admin Authentication**: Uses static bearer token, not production-grade security
- **No Payment Gateway**: Checkout creates order record but doesn't process payment
- **No Email Notifications**: Order confirmation shown on page, not sent via email
- **No User Accounts**: Cart persists in localStorage, not associated with user profile
- **Limited Concurrency Testing**: Row-level locking implemented but not stress-tested under heavy load

## Troubleshooting

### "could not find driver" (SQLite)
Install the PHP SQLite extension:
```bash
sudo apt install php-sqlite3
php -m | grep sqlite  # Verify installation
```

### "Access denied" (PostgreSQL)
Verify your database credentials in `backend/.env` are correct.

### Frontend can't connect to backend
1. Ensure backend is running on port 8000
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
3. Verify CORS is configured (already set in `backend/.env` as `FRONTEND_URL`)

### "Unauthorized" on admin endpoints
Include the Authorization header with the correct token from `backend/.env`:
```bash
curl -H "Authorization: Bearer dev-secret-token-12345" \
  http://localhost:8000/api/v1/admin/products
```

## Deployment (Optional)

### Frontend (Vercel)
```bash
cd frontend
vercel deploy --prod
```

### Backend (Render)
1. Create new project on [Render](https://render.com)
2. Add PostgreSQL database
3. Connect GitHub repository
4. Set environment variables from `backend/.env.example`
5. Deploy

### Admin Access
```
Email: admin@minishop.com
Password: admin123
```

## License

This project is created for the Roketin case study evaluation.
