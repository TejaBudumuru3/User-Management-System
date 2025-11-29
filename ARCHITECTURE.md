
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
└── lib/ ← api.ts (axios instance)



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
