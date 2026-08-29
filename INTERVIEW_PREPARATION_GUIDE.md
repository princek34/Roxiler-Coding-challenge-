# 🎯 Store Rating Platform — Interview Preparation & Technical Deep-Dive Guide

---

## 📑 Table of Contents
1. [Project Elevator Pitch](#1-project-elevator-pitch)
2. [High-Level Architecture & Tech Stack Justification](#2-high-level-architecture--tech-stack-justification)
3. [Database Schema & Data Modeling](#3-database-schema--data-modeling)
4. [Role-Based Access Control (RBAC) & Authentication Workflow](#4-role-based-access-control-rbac--authentication-workflow)
5. [Key Feature Implementations & Technical Details](#5-key-feature-implementations--technical-details)
6. [Security Best Practices Implemented](#6-security-best-practices-implemented)
7. [Comprehensive Interview Questions & Answers](#7-comprehensive-interview-questions--answers)
   - [Section A: Architecture & System Design](#section-a-architecture--system-design)
   - [Section B: Backend & Database (Node.js / Express / MySQL / Sequelize)](#section-b-backend--database-nodejs--express--mysql--sequelize)
   - [Section C: Frontend & State Management (React / Vite / Tailwind)](#section-c-frontend--state-management-react--vite--tailwind)
   - [Section D: Security, Performance & Scalability](#section-d-security-performance--scalability)
   - [Section E: Behavioral & Scenario-Based Questions (STAR Method)](#section-e-behavioral--scenario-based-questions-star-method)

---

## 1. Project Elevator Pitch

### ⏱️ 30-Second Quick Pitch
> "I built **RateHub**, a production-ready, full-stack store rating platform using **React 18, Node.js/Express, MySQL, and Sequelize ORM**. The platform implements a unified authentication portal with strict Role-Based Access Control across three distinct user roles: **System Administrators**, **Store Owners**, and **Normal Users**. It features real-time star rating submissions and modifications, multi-criteria filtering, dual-direction table sorting, and robust two-tier form validations with sanitized input handling."

### 🎙️ 2-Minute Detailed Pitch
> "The goal of this project was to build an end-to-end web application that allows customers to discover stores and submit authentic 1-to-5 star ratings while empowering store owners and administrators with actionable analytics.
>
> On the **backend**, I architected a RESTful API using Express with a modular MVC pattern. I used Sequelize ORM with MySQL 8.0, designing a normalized relational schema with unique composite constraints to enforce that a user can have at most one rating per store with seamless update capabilities. Authentication is handled via stateless JWTs with bcrypt password hashing and custom authorization middlewares.
>
> On the **frontend**, I built a responsive, modern UI with React, Vite, and Tailwind CSS. It features a single login gateway that automatically routes users to their role-specific portals. I built dynamic store catalogs with live search by name and location, interactive star rating widgets, and custom sortable data tables.
>
> To guarantee code quality, I implemented two-tier validation using `express-validator` on the server and real-time regex/length checks on the client, along with a self-booting end-to-end API test suite."

---

## 2. High-Level Architecture & Tech Stack Justification

```
[React 18 Client + Vite + Tailwind]
       │ (HTTP REST / JWT Bearer)
       ▼
[Express.js Gateway / Port 5000]
       │
       ├─► Middlewares: CORS, Auth (JWT), Role (RBAC), Express-Validator
       ├─► Controllers: AuthController, AdminController, StoreController, RatingController
       ├─► Sequelize Models: User, Store, Rating
       ▼
[MySQL 8.0 Database (store_rating_db)]
```

### Why This Tech Stack?

| Technology | Why Chosen Over Alternatives |
|---|---|
| **React 18 + Vite** | Vite offers near-instantaneous Hot Module Replacement (HMR) and optimized esbuild bundling compared to legacy Create React App. React's declarative state model enables smooth interactive rating widgets and real-time filter states. |
| **Tailwind CSS** | Utility-first styling eliminated stylesheet bloat, allowed rapid prototyping of accessible modals, badges, and responsive tables without runtime overhead. |
| **Node.js + Express.js** | Non-blocking, event-driven I/O ideal for handling concurrent I/O requests for store browsing, ratings, and analytics with lightweight footprint. |
| **MySQL 8.0 + Sequelize** | Relational integrity was essential to enforce strict foreign key constraints between `Users`, `Stores`, and `Ratings`. Sequelize provides type safety, automatic migrations, pre-save hashing hooks, and SQL injection protection through parameterized queries. |
| **JWT (JSON Web Tokens)** | Enables scalable, stateless authentication. The server verifies tokens using cryptographic signatures without needing session database lookups on every request. |

---

## 3. Database Schema & Data Modeling

### Entities & Relationships
1. **User**:
   - Fields: `id`, `name` (VARCHAR 60), `email` (VARCHAR 255 UNIQUE), `password` (VARCHAR 255 Hashed), `address` (VARCHAR 400), `role` (`SYSTEM_ADMIN` | `NORMAL_USER` | `STORE_OWNER`).
   - Relationships: Has one `Store` (as owner, optional); has many `Ratings`.
2. **Store**:
   - Fields: `id`, `name` (VARCHAR 60), `email` (VARCHAR 255 UNIQUE), `address` (VARCHAR 400), `ownerId` (FK nullable -> User.id).
   - Relationships: Belongs to `User` (as owner); has many `Ratings`.
3. **Rating**:
   - Fields: `id`, `userId` (FK -> User.id), `storeId` (FK -> Store.id), `rating` (INT 1-5).
   - Unique Composite Constraint: `(userId, storeId)` ensures one rating per user per store with modification ability.

---

## 4. Role-Based Access Control (RBAC) & Authentication Workflow

1. User enters Email & Password on `/login`.
2. Client sends `POST /api/auth/login`.
3. Backend fetches user, validates password using `bcrypt.compare()`.
4. Backend generates JWT payload `{ id, email, role }` signed with `JWT_SECRET`.
5. Frontend stores token in `localStorage`, updates React `AuthContext`, and redirects based on role:
   - `SYSTEM_ADMIN` ➔ `/admin/dashboard`
   - `STORE_OWNER` ➔ `/owner/dashboard`
   - `NORMAL_USER` ➔ `/user/dashboard`

---

## 5. Security Best Practices Implemented

1. **Password Hashing**: `bcryptjs` with 10 salt rounds in Sequelize lifecycle hooks (`beforeCreate`, `beforeUpdate`).
2. **Stateless JWT Authorization**: Bearer tokens with expiration (7-day default), verified via custom `authenticate` middleware.
3. **Role-Based Authorization (`authorize` middleware)**: Route-level guards verifying `req.user.role` matches allowed roles (e.g. `authorize('SYSTEM_ADMIN')`).
4. **SQL Injection Defense**: All Sequelize queries utilize parameterized queries and bound values.
5. **CORS & Environment Isolation**: Configured CORS origin whitelist and sensitive credentials stored exclusively in `.env`.
6. **Centralized Error Handling**: Prevents internal database stack traces from leaking in production responses.

---

## 6. Comprehensive Interview Questions & Answers

### Section A: Architecture & System Design

#### Q1: Can you walk me through the high-level architecture of your project?
**Answer:**
"I designed the application following a decoupled client-server architecture. 
- The **frontend** is a single-page application built with React 18 and Vite. It utilizes Context API for global authentication state and React Router v6 for client-side routing with role-based route guards.
- The **backend** is a RESTful API built on Node.js and Express.js, structured around the MVC pattern with separate layers for routing, middleware (authentication, authorization, request validation), controllers (business logic), and Sequelize models (data access).
- The **database** layer is MySQL 8.0, where data integrity is maintained using foreign keys, cascading rules, and unique composite constraints."

#### Q2: Why did you implement a single login system instead of separate login pages for Admins, Users, and Store Owners?
**Answer:**
"A unified login endpoint is an industry standard because it provides a cleaner user experience and simplifies authentication architecture. Instead of maintaining three separate authentication endpoints and forms, all users authenticate through `POST /api/auth/login`. The server verifies their credentials and issues a signed JWT containing their specific role. The frontend `AuthContext` inspects this role and conditionally mounts the correct navigation bar and redirects the user to their respective dashboard (`/admin/dashboard`, `/owner/dashboard`, or `/user/dashboard`)."

#### Q3: How did you handle authorization and prevent unauthorized access to Admin endpoints?
**Answer:**
"I implemented a two-tier middleware pattern:
1. `authenticate`: Extracts the Bearer token from the `Authorization` header, verifies its cryptographic signature using our `JWT_SECRET`, and fetches the authenticated user from the database, attaching it to `req.user`.
2. `authorize(...roles)`: A higher-order middleware that checks if `req.user.role` matches the permitted roles for that route. For example, all admin routes are protected by `router.use(authenticate, authorize('SYSTEM_ADMIN'))`. If an unauthenticated or unauthorized request is made, it immediately halts execution and returns a `401 Unauthorized` or `403 Forbidden` JSON response."

---

### Section B: Backend & Database (Node.js / Express / MySQL / Sequelize)

#### Q4: How do you prevent a normal user from submitting multiple ratings for the same store?
**Answer:**
"I enforced this at both the database level and application level:
1. **Database level**: I defined a composite unique index on the `Ratings` table across `(userId, storeId)`. This makes it mathematically impossible for duplicate rows to exist for the same user and store.
2. **Application level**: In `ratingController.js`, when a user submits a rating, we query `Rating.findOne({ where: { userId, storeId } })`. If an existing rating is found, we update the existing rating value; otherwise, we create a new rating record. This provides an intuitive experience where users can submit and update their ratings seamlessly."

#### Q5: How is the average rating for a store calculated, especially when a Store Owner or Admin views the store?
**Answer:**
"When fetching stores or users, we use Sequelize associations to `include` the `Rating` model. In SQL terms, this performs a `LEFT JOIN` on the `ratings` table.
In JavaScript, we aggregate the ratings array:
```javascript
const ratings = store.ratings || [];
const count = ratings.length;
const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
const averageRating = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
```
For Store Owners in the Admin directory, we fetch their assigned store, include its ratings, and compute the average so admins can see performance metrics alongside user profile details."

#### Q6: How do you handle errors centrally in Express?
**Answer:**
"I built a centralized error-handling middleware (`errorHandler.js`) placed at the end of the Express middleware pipeline. Controllers wrap async logic in `try-catch` blocks and pass unexpected errors via `next(error)`. 
The error handler categorizes errors:
- `SequelizeUniqueConstraintError`: Returns a clean `400` with the conflicting field (e.g. email already exists).
- `SequelizeValidationError`: Returns a `400` with specific field validation messages.
- `SequelizeConnectionError`: Returns a `503 Service Unavailable` with database diagnostic instructions.
- Standard errors: Returns the appropriate status code without leaking stack traces in production."

---

### Section C: Frontend & State Management (React / Vite / Tailwind)

#### Q7: How does the client-side ProtectedRoute component work?
**Answer:**
"`ProtectedRoute` is a wrapper component for React Router. It reads `user`, `token`, and `loading` from `useAuth()`.
- While the session is being initialized from `localStorage`, it renders a loading spinner.
- If no authenticated user exists, it redirects to `/login` with `state: { from: location }` so the user can be returned to their intended page after logging in.
- If the route requires specific roles (e.g. `allowedRoles={['SYSTEM_ADMIN']}`) and the current user's role is not included, it redirects them to their appropriate dashboard."

#### Q8: How did you implement real-time form validation with live feedback in the UI?
**Answer:**
"I created a modular validation utility (`src/utils/validation.js`) with dedicated validator functions (`validateName`, `validateEmail`, `validateAddress`, `validatePassword`) and a helper `getPasswordChecks(password)`.
In form components like `Signup.jsx`:
- As the user types, state updates live.
- Password complexity requirements display real-time green checkmarks for length (8-16), uppercase letter (A-Z), and special character (`!@#$%^&*`).
- On input blur (`handleBlur`), touched states are updated so error messages only appear after the user interacts with a field, preventing premature validation errors."

#### Q9: How did you handle table sorting for both database fields and computed metrics?
**Answer:**
"Each sortable table column header has an `onClick` handler that toggles between `ASC` and `DESC` and sets the `sortBy` field. 
For database columns (`name`, `email`, `address`, `createdAt`), the parameters are passed to the backend API which executes SQL `ORDER BY`. 
For computed metrics like `overallRating` or `myRating`, the backend executes in-memory sorting over the aggregated results before returning the paginated payload to the client."

---

### Section D: Security, Performance & Scalability

#### Q10: How do you protect against SQL Injection attacks?
**Answer:**
"We utilize Sequelize ORM, which uses parameterized queries and prepared statements under the hood. When executing queries with user inputs, Sequelize passes variables separately from the SQL command structure (e.g., using `?` placeholders), preventing malicious strings from altering the SQL syntax."

#### Q11: How is user password security handled?
**Answer:**
"Plaintext passwords are never stored in the database. In the Sequelize `User` model, we defined `beforeCreate` and `beforeUpdate` lifecycle hooks that generate a cryptographic salt using `bcryptjs.genSalt(10)` and hash the password before saving. Additionally, the `User.prototype.toJSON` method deletes the `password` property from serialized user objects, ensuring password hashes are never included in API JSON responses."

#### Q12: If this application scaled to 1,000,000 stores and 10,000,000 ratings, what performance optimizations would you introduce?
**Answer:**
"I would implement the following optimizations:
1. **Denormalization / Cached Aggregates**: Instead of calculating average rating on the fly via table joins for every query, I would maintain `averageRating` and `totalRatingsCount` directly on the `Stores` table, updated via database triggers or background queues whenever a new rating is added or modified.
2. **Redis Caching**: Cache top-rated stores and store catalog pages in Redis with short TTLs or cache invalidation on rating updates.
3. **Database Indexing**: Add composite B-Tree indexes on `(storeId, rating)` and `(address)` for fast filtering and aggregate calculations.
4. **Pagination**: Implement cursor-based or limit-offset pagination on all list endpoints."

---

### Section E: Behavioral & Scenario-Based Questions (STAR Method)

#### Q13: Tell me about a challenging bug you encountered during development and how you solved it.
- **Situation**: When testing user sign-up with shorter names, the backend threw a 500 internal server error.
- **Task**: Identify the root cause across the database model, validation layers, and error handler to ensure smooth registration.
- **Action**: I traced the request through the Express middleware stack and found that Sequelize model-level validation had a lingering 20-character minimum restriction that mismatched the updated requirements. Furthermore, the generic error handler was catching the validation error and returning a 500 status code. I updated the Sequelize `User` model, aligned the `express-validator` rules to a 2-character minimum, and refactored `errorHandler.js` to specifically catch `SequelizeValidationError` and return structured 400 Bad Request responses with detailed field errors.
- **Result**: Sign-up succeeded instantly, and the error handler became completely resilient to all validation and database error types.

#### Q14: How do you ensure code maintainability and separation of concerns?
**Answer:**
"I adhere to strict separation of concerns:
- **Routes** only declare URL paths and attach middlewares.
- **Middlewares** handle cross-cutting concerns (authentication, role checks, schema validation).
- **Controllers** orchestrate the business logic and HTTP response formatting.
- **Models** encapsulate database schema definitions, associations, and lifecycle hooks.
- **Frontend Services** isolate all Axios HTTP calls into dedicated service modules (`authService`, `adminService`, `storeService`, `ratingService`), keeping React UI components clean and focused purely on rendering and user interaction."
