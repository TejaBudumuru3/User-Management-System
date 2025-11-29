# Postman Collection Guide

This Postman collection tests all the main API endpoints. I spent some time setting up the auto-token saving so you don't have to copy-paste tokens manually.

## How to Use

1. **Import the collection**: `postman_collection.json`
2. **Create Environment** (or use Collection variables):

baseUrl = http://localhost:3000/api

3. **Run in this order**:
   
  1. Register → Creates test user
  
  2. Login → Token auto-saves to 'accessToken'
  
  3. /users/stats → Public endpoint (no token needed)
  
  4. /users/me → Uses saved token
  
  5. Admin endpoints → Only works if logged in as admin
  

## What Each Request Does

### Auth Folder
- **Register**: Creates user with image upload (uses FormData). Change email/phone to avoid duplicates.
- **Login**: Flexible login (email OR phone). **Test script auto-saves token** - this was the best part!

### Public Endpoints
- **Get Public Stats**: No auth needed. Shows total users, cities, recent activity.

### User Endpoints  
- **Get Current User (/me)**: Shows your profile. Token added automatically.

### Admin Endpoints
- **Get All Users**: Pagination + search. Set `?page=1&limit=10&search=John`
- **Update User**: Edit name/email/phone. Uses `{{userId}}` from login response.
- **Delete User**: Permanent delete. Careful with this one!

## Pro Tips

- After login, check **Console** tab - it logs "Token saved: eyJhbGciOi..."
- For admin testing: Register first user as admin manually in MongoDB, or update `role: 'admin'` in register body
- `{{userId}}` gets set automatically from login response
- Image upload in register uses real FormData - works exactly like frontend

## Common Issues

  "Invalid token" → Run Login first
  404 on /users → Need admin role
  No users found → Register some first
  Token auto-saves → No copy-paste needed!


This collection took longer than expected because of the token handling, but now it's smooth. Just register → login → everything else works.

# Database Schema (MongoDB)

Single `users` collection. No complicated relationships - kept it simple.

## User Document Structure


{
  "_id": ObjectId("6929ee42ddea5c09917da4d8"),
  "name": "John Doe", // Display name
  "email": "john@example.com", // Unique login field
  "phone": "9876543210", // OR login field (flexible)
  "password": "$2b$10$hashedpassword", // bcrypt hashed
  "role": "user", // "admin" | "user" (RBAC)
  "profileImage": "/uploads/abc123.jpg", // Multer file path
  "city": "Visakhapatnam",
  "state": "Andhra Pradesh",
  "country": "India",
  "pincode": "530001",
  "createdAt": ISODate("2025-11-29T..."),
  "updatedAt": ISODate("2025-11-29T...")
}


## Key Decisions

- **Flexible login**: `user` field accepts email OR phone
- **Single collection**: No separate profiles/admins - role field handles it
- **Image path only**: Store `/uploads/filename.jpg` not binary data
- **India-focused**: Default country = "India", pincode format

## Indexes (Auto-created by Mongoose)

email → unique
phone → unique
role → frequent queries
createdAt → stats + sorting


## Sample Queries I Used

// Admin dashboard (pagination)
db.users.find({
$or: [{name: /john/i}, {email: /john/i}]
}).skip(0).limit(10).sort({createdAt: -1})

// Public stats
db.users.aggregate([
{ $group: { _id: "$city", count: { $sum: 1 } } },
{ $sort: { count: -1 } }
])


This schema was straightforward but the `role` field + image upload path were the key pieces for RBAC and file handling.

ARCHITECTURE.md (How it actually works):

# System Architecture

Simple 3-tier setup: React frontend → Express API → MongoDB. Nothing fancy, just works.

## Request Flow

Browser (localhost:5173)
↓ GET /dashboard
React Router
↓ Check localStorage token
Axios
↓ Authorization: Bearer <token>
Express Middleware (authenticateToken)
↓ JWT verify → req.user = {userid, role}
Controller (getCurrentUser)
↓ User.findById(req.user.userid)
MongoDB
↓ { role: "admin" | "user" }
Response
↓ role === "admin" ? UsersTable : UserProfile
React State
↓ Render appropriate dashboard


## Code Organization

backend/
├── controllers/ ← Business logic
├── middleware/ ← auth, multer, rbac
├── models/ ← User schema
├── routes/ ← users.ts, auth.ts
└── utils/ ← verifyToken helper

frontend/
├── components/ ← Reusable UI
├── pages/ ← Home, Dashboard, Register
├── lib/ ← api.ts (axios instance)
└── hooks/ ← useAuth


## Pain Points Fixed

1. **JWT mismatch**: Token had `userid`, controllers expected `_id`. Fixed in middleware.
2. **Multer field names**: Frontend `FormData.append('profileImage')` → Backend `uploadProfile.single('profileImage')`
3. **Pagination state**: Search + page changes → reset to page 1, keep search term
4. **Vercel 404**: `vercel.json` rewrites all routes to `index.html`

## Why This Stack?

- **React + Tailwind**: Fast UI, responsive out-of-box
- **Express + TS**: Familiar, type-safe APIs  
- **MongoDB**: Flexible schema, easy pagination
- **JWT stateless**: No session storage headaches
- **Multer**: Simple file upload (no S3 complexity)

The architecture prioritizes simplicity over features. Everything runs locally with `npm run dev` in two terminals.

├── POSTMAN-GUIDE.md     ← Copy #1
├── ER-DIAGRAM.md        ← Copy #2  
├── ARCHITECTURE.md      ← Copy #3
└── README.md            ← Link to these

Update README:

## 📚 Documentation
- [Postman Guide](POSTMAN-GUIDE.md)
- [Database Schema](ER-DIAGRAM.md)  
- [Architecture](ARCHITECTURE.md)
- [Full Docs](DOCUMENTATION.md)

