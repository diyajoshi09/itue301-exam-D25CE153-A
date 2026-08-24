# QuickBite Food Ordering System
**Course:** ITUE301 - Advanced Web Development Frameworks  
**Practical Exam Set:** Set A  
**Tech Stack:** React.js, Express.js, MongoDB, Mongoose, Node.js

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or MongoDB Atlas URI

---

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Ensure `.env` is present with `MONGO_URI` set: `mongodb://127.0.0.1:27017/quickbite_db`
4. Seed the database with sample data:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   # or: node server.js
   ```
   *The server runs on http://localhost:5000*

---

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on http://localhost:5173*

---

## 🌐 REST API Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Authenticate customer & generate Bearer token |
| `GET` | `/api/v1/restaurants` | Public | Fetch all restaurants list |
| `POST` | `/api/v1/orders` | Protected (`authGuard`) | Create a new order (Returns HTTP 201) |
| `GET` | `/api/v1/orders` | Protected (`authGuard`) | Get orders for logged in customer (Populated) |
| `PATCH` | `/api/v1/orders/:id/status` | Protected (`authGuard`) | Update order status |

---

## 🛡️ Middlewares Implemented
1. `requestLogger`: Logs every request as `[METHOD] [PATH] [TIMESTAMP]` globally.
2. `authGuard`: Validates Bearer token in the `Authorization` header; returns HTTP 401 if missing/invalid.
3. `errorHandler`: Global error handling middleware returning structured JSON responses for validation errors, invalid ObjectIds, and server errors.
