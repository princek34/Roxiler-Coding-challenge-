# 🌟 RateHub — Full-Stack Store Rating Platform

A production-ready full-stack web application built for the **FullStack Intern Coding Challenge**. The platform allows users to submit and modify ratings (1-5 stars) for registered stores, offers a single authentication gateway with strict role-based access control (RBAC), and provides dedicated workflows for **System Administrators**, **Normal Users**, and **Store Owners**.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios |
| **Backend** | Node.js, Express.js, Sequelize ORM, Express-Validator, Morgan |
| **Database** | MySQL 8.0 / PostgreSQL compatible schema |
| **Authentication** | JWT (JSON Web Tokens) with bcrypt password hashing & Role-Based Middleware |

---

## ✨ Features by Role

### 1. 🛡️ System Administrator
- **Analytics Dashboard**: Live overview showing:
  - Total number of registered users (with breakdown: Admins, Store Owners, Normal Users)
  - Total number of stores
  - Total number of submitted customer ratings
- **User Management**:
  - View list of all normal, store owner, and admin users with: **Name, Email, Address, Role**.
  - If a user is a **Store Owner**, their assigned store's **Average Rating & Total Ratings Count** are automatically calculated and displayed.
  - **Filters**: Real-time filtering by **Name, Email, Address, and Role**.
  - **Sorting**: Ascending / Descending sorting across all key table columns.
  - **User Profile Modal**: Detailed inspection modal for any user.
  - **Add New Users**: Form to create Admin, Normal User, or Store Owner accounts with full validation.
- **Store Management**:
  - View all registered stores with: **Store Name, Email, Address, Overall Rating (Average & Count), Assigned Owner**.
  - **Filters**: Filter stores by **Name, Email, Address**.
  - **Sorting**: Ascending / Descending sorting across Name, Email, Address, Rating.
  - **Add New Stores**: Form with Name, Email, Address, and optional Store Owner assignment from registered store owners.
- **Security**: Can update personal password and log out securely.

---

### 2. 👤 Normal User
- **Self-Registration**: Sign up with live requirement validation and character counter.
- **Single Sign-in**: Seamless login with instant role resolution.
- **Store Discovery**:
  - View catalog of all registered stores with: **Store Name, Address, Overall Rating (Average & Count), and User's Submitted Rating**.
  - Search stores by **Name** and **Address**.
  - Sort store listings by **Store Name, Address, Overall Rating, and My Rating**.
- **Rating Submissions**:
  - Submit ratings between **1 to 5 stars** with interactive visual feedback and star descriptions.
  - **Modify Submitted Rating**: Users can update their previous rating for any store at any time.
- **Security**: Update password with strict validation and log out securely.

---

### 3. 🏪 Store Owner
- **Single Sign-in**: Access dedicated store management dashboard.
- **Store Analytics**:
  - Store profile information (Name, Email, Address).
  - Prominent **Average Store Rating** indicator (out of 5.0 stars) and **Total Customer Ratings Count**.
- **Customer Ratings Table**:
  - View list of all customers who rated their store: **Customer Name, Customer Email, Address, Submitted Rating (1-5), and Submission Date**.
  - **Sorting**: Sort table columns by Customer Name, Email, Submitted Rating, and Date.
- **Security**: Update password and log out securely.

---

## 🔒 Form Validations Specification

Strict validation rules are implemented across both the frontend (real-time feedback) and backend (`express-validator` & `Sequelize` model validation):

| Field | Validation Rule |
|---|---|
| **Name** | Min 20 characters, Max 60 characters |
| **Address** | Max 400 characters, required |
| **Password** | 8-16 characters, must include at least one uppercase letter (A-Z) and one special character (`!@#$%^&*...`) |
| **Email** | Standard RFC 5322 compliant email format |
| **Rating** | Integer between 1 and 5 stars |

---

## 🔑 Demo Accounts (Pre-Seeded)

The database is pre-seeded with ready-to-test accounts across all roles:

| Role | Email | Password | Notes |
|---|---|---|---|
| **System Admin** | `admin@storerating.com` | `Admin@Password123` | Full administrative control |
| **Store Owner 1** | `alexander.owner@store.com` | `Owner@Password123` | Owner of "Organic Grocery Supermarket Central" |
| **Store Owner 2** | `nolan.owner@store.com` | `Owner@Password123` | Owner of "Apex Digital Electronics Megastore" |
| **Normal User 1** | `jonathan.user@gmail.com` | `User@Password123` | Has pre-submitted store ratings |
| **Normal User 2** | `benjamin.user@gmail.com` | `User@Password123` | Has pre-submitted store ratings |

> 💡 *The login screen includes quick 1-click test account filler buttons for instant review.*

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- Node.js (v18+ or v22+)
- MySQL Server 8.0 (or PostgreSQL)

### 1. Clone or Open Project Directory
```bash
cd "C:\Users\prince kumar\projects\store-rating-platform"
```

### 2. Configure Backend Environment
Edit `backend/.env` if your MySQL port/password differs:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Prince@123
DB_NAME=store_rating_db
DB_DIALECT=mysql

# JWT configuration
JWT_SECRET=super_secret_jwt_key_store_rating_platform_2026_secure
JWT_EXPIRES_IN=7d
```

### 3. Seed the Database
To reset the database tables and insert sample test data:
```bash
npm run seed
```

### 4. Run Both Backend & Frontend Concurrently
From the root directory:
```bash
npm run dev
```

Or run them individually in separate terminals:
- **Backend**: `cd backend && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend**: `cd frontend && npm run dev` (Runs on `http://localhost:5173`)

### 5. Access the Web Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register new Normal User
- `POST /api/auth/login` — Single login endpoint for all roles
- `GET /api/auth/me` — Get current logged-in profile
- `PUT /api/auth/change-password` — Change password (all roles)

### Admin Management (`/api/admin` - Admin Only)
- `GET /api/admin/dashboard` — Total users, stores, and ratings counts
- `GET /api/admin/users` — List users with filters (name, email, address, role) & sorting
- `GET /api/admin/users/:id` — View specific user details
- `POST /api/admin/users` — Create new user (Admin, Normal User, Store Owner)
- `GET /api/admin/stores` — List stores with filters & sorting
- `POST /api/admin/stores` — Create new store & optionally assign owner
- `GET /api/admin/store-owners` — List store owners for assignment

### Stores (`/api/stores`)
- `GET /api/stores` — List stores with search (name, address), sorting, overall rating, and current user's rating
- `GET /api/stores/:id` — Get store details

### Ratings (`/api/ratings`)
- `POST /api/ratings` — Submit or update rating (1-5 stars)
- `PUT /api/ratings/:id` — Modify existing rating
- `GET /api/ratings/owner-dashboard` — Store owner view of their store's ratings and users

---

## 📁 Project Directory Structure

```text
store-rating-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── ratingController.js
│   │   │   └── storeController.js
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── Rating.js
│   │   │   ├── Store.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── index.js
│   │   │   ├── ratingRoutes.js
│   │   │   └── storeRoutes.js
│   │   ├── utils/
│   │   │   ├── seed.js
│   │   │   └── validators.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StarRating.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AddStoreModal.jsx
│   │   │   │   ├── AddUserModal.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminStores.jsx
│   │   │   │   ├── AdminUsers.jsx
│   │   │   │   └── UserDetailsModal.jsx
│   │   │   ├── owner/
│   │   │   │   └── OwnerDashboard.jsx
│   │   │   ├── user/
│   │   │   │   ├── RateStoreModal.jsx
│   │   │   │   └── UserDashboard.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/
│   │   │   ├── adminService.js
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── ratingService.js
│   │   │   └── storeService.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── README.md
```
