## Vehicle Rental System – Backend API

### Live URL: https://b6-a2-vehicle-rental-server.vercel.app/ <br>
### GitHub Repository: https://github.com/SobuZ391/Vehicle-Rental-Sever/

-A modular and scalable backend API for managing vehicle rentals with authentication, role-based authorization, vehicle inventory, and booking lifecycle handling.

 ## Features
 Authentication & Authorization

 User registration and login with JWT

Password hashing using bcrypt

Role-based access (admin, customer)

Protected routes for sensitive operations

## User Management

Admin: view all users

Admin: update/delete any user

Customer: update own profile

Prevent deletion if active bookings exist

## Vehicle Management

Admin-only: add, update, delete vehicles

Public: view vehicles

Availability tracking (available, booked)

## Booking Management

Customers create new bookings

Automatic price calculation

Prevent double-booking of the same vehicle

Cancel booking (customer, before start date)

Mark as returned (admin)

Auto-update vehicle status

## Technology Stack

Language	Node.js + TypeScript <br>
Framework	Express.js <br>
Database	PostgreSQL (Neon / Supabase) <br>
Auth	JWT (jsonwebtoken) <br>
Security	bcryptjs <br>
Deployment	Vercel Serverless Functions <br>
Package Manager	npm <br>


## Setup Instructions
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



4️- Start Development Server
npm run dev


Server will run at:

http://localhost:5000

## Usage Instructions (Testing)
Authentication
POST /api/v1/auth/signup <br>
POST /api/v1/auth/signin <br>

## Vehicles
POST /api/v1/vehicles            (admin) <br>
GET  /api/v1/vehicles            (public) <br>
GET  /api/v1/vehicles/:id        (public) <br>
PUT  /api/v1/vehicles/:id        (admin) <br>
DELETE /api/v1/vehicles/:id      (admin) <br>

## Users
GET  /api/v1/users               (admin) <br>
PUT  /api/v1/users/:id           (admin or owner) <br>
DELETE /api/v1/users/:id         (admin) <br>

## Bookings
POST /api/v1/bookings            (customer/admin) <br>
GET  /api/v1/bookings            (role-based) <br>
PUT  /api/v1/bookings/:id        (cancel or return) <br>

Use Authorization Header for protected routes:
Authorization: Bearer <token>
