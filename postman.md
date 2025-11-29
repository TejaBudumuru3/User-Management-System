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


## 📚 Documentation
- [Postman Guide](POSTMAN-GUIDE.md)
- [Database Schema](ER-DIAGRAM.md)  
- [Architecture](ARCHITECTURE.md)
- [Full Docs](DOCUMENTATION.md)

