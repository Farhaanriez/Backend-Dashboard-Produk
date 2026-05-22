# Dashboard Produk - Backend API

Backend API untuk Dashboard Produk dengan Express.js, Prisma ORM, dan PostgreSQL.

## 🚀 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Logging:** Pino
- **Security:** Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

## 🛠️ Installation

1. Clone repository
```bash
git clone <repo-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

4. Setup database
```bash
# Create database
createdb dashboard_produk

# Run migrations
npm run prisma:migrate

# (Optional) Seed data
npx prisma db seed
```

5. Generate Prisma Client
```bash
npm run prisma:generate
```

## 🏃 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Database Management
```bash
# Open Prisma Studio (GUI)
npm run prisma:studio

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 📚 API Documentation

### Base URL
http://localhost:5000/api

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Products Endpoints

#### Get All Products (Public)
```http
GET /api/products?search=laptop&kategori=Elektronik&page=1&limit=10
```

#### Get Product by ID (Public)
```http
GET /api/products/:id
```

#### Get Categories (Public)
```http
GET /api/products/categories
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nama": "Laptop Gaming",
  "kategori": "Elektronik",
  "harga": 15000000,
  "deskripsi": "Laptop gaming dengan spesifikasi tinggi",
  "stok": 5
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nama": "Laptop Gaming Updated",
  "harga": 14000000
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer {accessToken}
```

## 🔐 Default Admin Account
Email: admin@dashboard.com
Password: admin123
Role: ADMIN

## 🏗️ Architecture

### Layered Pattern
Request → Routes → Controllers → Services → Repositories → Database
- **Routes**: Define endpoints
- **Controllers**: Handle HTTP request/response
- **Services**: Business logic
- **Repositories**: Database queries

### Folder Structure
src/
├── config/           # Configuration files
├── features/         # Feature modules
│   ├── auth/
│   └── products/
├── middlewares/      # Express middlewares
├── utils/           # Utility functions
└── types/           # TypeScript types

## 🛡️ Security Features

- ✅ Helmet.js - Security headers
- ✅ CORS - Cross-origin protection
- ✅ Rate Limiting - DDoS protection
- ✅ JWT - Stateless authentication
- ✅ Bcrypt - Password hashing
- ✅ Zod - Input validation
- ✅ SQL Injection protection (via Prisma)

## 📊 Database Schema

### Users Table
```sql
- id: INT (PK, Auto)
- email: STRING (Unique)
- password: STRING (Hashed)
- name: STRING (Nullable)
- role: ENUM (USER, ADMIN)
- createdAt: DATETIME
- updatedAt: DATETIME
```

### Products Table
```sql
- id: INT (PK, Auto)
- nama: STRING
- kategori: STRING
- harga: INT
- deskripsi: TEXT
- stok: INT
- createdAt: DATETIME
- updatedAt: DATETIME
```

### RefreshTokens Table
```sql
- id: INT (PK, Auto)
- token: STRING (Unique)
- userId: INT (FK)
- expiresAt: DATETIME
- createdAt: DATETIME
```

## 🧪 Testing with Thunder Client / Postman

1. Import collection (jika ada)
2. Set environment variables:
   - `BASE_URL`: http://localhost:5000/api
   - `ACCESS_TOKEN`: (akan di-set setelah login)

3. Test flow:
   - Register → Login → Get Products → Create Product (as admin)

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check DATABASE_URL in .env
# Make sure credentials are correct
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### Prisma Client Error
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

## 📝 License

MIT

## 👨‍💻 Author

[Farhan Rizky]
