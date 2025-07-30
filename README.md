# Ride Booking System Backend

## Project Overview

This project is a secure, scalable, and role-based backend API for a ride booking system (similar to Uber or Pathao), built with **Express.js** and **Mongoose**. The system supports three user roles: **admin**, **rider**, and **driver**. It enables riders to request rides, drivers to accept and complete rides, and admins to manage users and rides. The architecture is modular and follows RESTful API conventions.

**Key Features:**

- JWT-based authentication and role-based authorization
- Secure password hashing
- Rider and driver ride management logic
- Admin user and ride management
- Modular, scalable codebase

---

## Setup & Environment Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/mehedifiz/server-ride-booking-system-
   cd server-ride-booking-system-

   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/ride-booking
     JWT_SECRET=your_jwt_secret
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```

---

## API Endpoints Summary

### Authentication

| POST | `/api/v1/auth/register` | Register a new user (role: rider/driver)
| POST | `/api/v1/auth/login` | Login and receive JWT token

### Rider Endpoints

| POST | `/api/v1/ride/request` | Request a new ride | Rider |
| PATCH | `/api/v1/ride/cancelRide/:rideId` | Cancel a ride (if allowed) | Rider |
| GET | `/api/v1/ride/myRides` | View ride history | Rider |

### Driver Endpoints

| GET | `/api/v1/ride/my-accepted` | View accepted rides | Driver |
| POST | `/api/v1/ride/updateStatus/:rideId` | Update ride status (Picked Up, In Transit, Completed) | Driver |
| GET | `/api/v1/ride/earningsHistory` | View earnings history (Driver )
| GET | `/api/v1/ride/all` | View all rides | Admin | rider

### Admin Endpoints

| GET | `/api/v1/user/allUsers` | View all users | Admin |
| PATCH | `/api/v1/user/:id/block` | Block/unblock a user | Admin |
| PATCH | `/api/v1/user//:id/availability` | Approve/suspend a driver | Admin |
| GET | `/api/v1/ride/all` | View all rides | Admin |
| GET | `/api/v1/stats/` | View system statistics | Admin |

---

## Notes

- All protected endpoints require a valid JWT token in the `Authorization` header.
- Role-based access is enforced for all sensitive routes.
- For detailed request/response formats, refer to the controller and validation files in the codebase.

---

**For questions or contributions, please open an issue or submit a pull request.**
