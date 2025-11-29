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


