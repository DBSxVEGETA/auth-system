# Authentication System

A secure and lightweight authentication system built using **Node.js**, **Express.js**, **PostgreSQL** (with raw SQL), **EJS templates**, **JWT for session management**, and **Google reCAPTCHA** for bot protection.

---

## ✨ Features

- User Registration and Login
- JWT-based Session Management
- EJS-based Server-side Rendering
- Google reCAPTCHA v2 on Login
- PostgreSQL with raw SQL queries
- Secure Password Hashing with bcrypt
- Session Expiry Warning with JavaScript Alerts

---

## ⚙️ Technologies Used

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **EJS**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **Google reCAPTCHA v2**

---

## 🚀 Getting Started

### 1. Clone the Repository
git clone https://github.com/your-username/auth-system.git
cd auth-system

### 2. Install Dependencies
npm install

### 3. Set Up Environment Variables
Create a .env file:

PORT=3000
DB_URL=postgresql://username:password@localhost:5432/auth-system-db
JWT_SECRET=your_jwt_secret
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

### 4. Initialize the Database

npm run db:init
Ensure the database (auth-system-db) exists in PostgreSQL.

### 5. Start the Server
npm run dev
Visit: http://localhost:5000

### 🧪 Testing the App
You can test endpoints using Postman or via browser UI:

GET /register → Show registration form

POST /register → Register a new user

GET /login → Show login form with reCAPTCHA

POST /login → Login with credentials

GET /profile → View profile (JWT protected)

POST /logout → Log out user


### 🔐 Security Notes
reCAPTCHA is only active on login

Passwords are securely hashed using bcrypt

JWT expiration and session warning included


### 📜 License
This project is open-source and available under the MIT License.

### 👨‍💻 Author
Made with ❤️ by Apurva Kumar
