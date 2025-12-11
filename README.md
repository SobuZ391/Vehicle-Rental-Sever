Vehicle Rental System – Backend API

Live URL: <YOUR_VERCEL_DEPLOYMENT_URL>
GitHub Repository: <YOUR_GITHUB_REPO_LINK>

A modular and scalable backend API for managing vehicle rentals with authentication, role-based authorization, vehicle inventory, and booking lifecycle handling.

 Features
 Authentication & Authorization

User registration and login with JWT

Password hashing using bcrypt

Role-based access (admin, customer)

Protected routes for sensitive operations

 User Management

Admin: view all users

Admin: update/delete any user

Customer: update own profile

Prevent deletion if active bookings exist

 Vehicle Management

Admin-only: add, update, delete vehicles

Public: view vehicles

Availability tracking (available, booked)

 Booking Management

Customers create new bookings

Automatic price calculation

Prevent double-booking of the same vehicle

Cancel booking (customer, before start date)

Mark as returned (admin)

Auto-update vehicle status

🛠️ Technology Stack
Layer	Technology
Language	Node.js + TypeScript
Framework	Express.js
Database	PostgreSQL (Neon / Supabase)
Auth	JWT (jsonwebtoken)
Security	bcryptjs
Deployment	Vercel Serverless Functions
Package Manager	npm
 Project Structure
src/
 ├─ config/
 ├─ middleware/
 ├─ modules/
 │   ├─ auth/
 │   ├─ user/
 │   ├─ vehicle/
 │   └─ booking/
 ├─ app.ts
 └─ index.ts  
api/
 └─ index.ts
vercel.json
.env.example

 Setup Instructions
1️- Clone the Repository
git clone <your-repo-url>
cd vehicle-rental-backend

2️- Install Dependencies
npm install

3️- Create .env File

Create a .env file at project root:

CONNECTION_STR=postgresql://user:pass@host:5432/dbname?sslmode=require
JWT_SECRET=your_jwt_secret_key
PORT=5000


Or copy from the provided .env.example.

4️- Start Development Server
npm run dev


Server will run at:

http://localhost:5000

Usage Instructions (Testing)
Authentication
POST /api/v1/auth/signup
POST /api/v1/auth/signin

Vehicles
POST /api/v1/vehicles            (admin)
GET  /api/v1/vehicles            (public)
GET  /api/v1/vehicles/:id        (public)
PUT  /api/v1/vehicles/:id        (admin)
DELETE /api/v1/vehicles/:id      (admin)

Users
GET  /api/v1/users               (admin)
PUT  /api/v1/users/:id           (admin or owner)
DELETE /api/v1/users/:id         (admin)

Bookings
POST /api/v1/bookings            (customer/admin)
GET  /api/v1/bookings            (role-based)
PUT  /api/v1/bookings/:id        (cancel or return)

Use Authorization Header for protected routes:
Authorization: Bearer <token>
