# 🚀 Harvee User Management System

**Full-stack MERN application with JWT auth, RBAC, image upload & Docker support.**

## ✨ Features

✅ **JWT Authentication** + **Role-Based Access Control** (Admin/User)  
✅ **Profile Image Upload** (Multer + FormData)  
✅ **Admin Dashboard**: CRUD + Search + Server-side Pagination  
✅ **Public Stats** endpoint (no auth)  
✅ **Dockerfiles** (Frontend + Backend)  
✅ **Postman Collection** (full API testing)  
✅ **Responsive UI** (Mobile + Desktop)

## 🚀 Quick Start (Local Setup)

### Backend
cd backend
cp .env.example .env
npm install
npm run dev

http://localhost:3000/api


### Frontend

cd frontend
cp .env.example .env
npm install
npm run dev

http://localhost:5173


**`.env` files needed:**

backend/.env
MONGODB_URI=mongodb://localhost:27017/userdb
JWT_SECRET=your-super-secret-key-min32chars
PORT=3000

frontend/.env
VITE_API_URL=http://localhost:3000/api


## 🐳 Docker (Optional)

### Backend Docker

cd backend
docker build -t harvee-backend .
docker run -p 3000:3000 -e MONGODB_URI="mongodb://host.docker.internal:27017/userdb" harvee-backend


### Frontend Docker

cd frontend
docker build -t harvee-frontend .
docker run -p 5173:80 harvee-frontend


## 🧪 API Testing (Postman)

1. Import `postman_collection.json`
2. Set environment variable: `baseUrl = http://localhost:3000/api`
3. **Flow**: Register → Login (auto-saves token) → Test all endpoints

**Endpoints covered:**
- `POST /auth/register` (multipart image upload)
- `POST /auth/login` (email/phone)
- `GET /users/stats` (public)
- `GET /users/me` (current user)
- `GET /users` (admin pagination + search)
- `PUT /users/:id` (admin update)
- `DELETE /users/:id` (admin delete)

## 📱 Demo Flow

Home → Public stats → Register/Login buttons

Register → Image upload → Redirect to login

Login → Role-based dashboard:
├─ Admin → Full CRUD table (search/paginate/edit/delete)
└─ User → Profile view only

Responsive on mobile/desktop


## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React 18 | Node.js + Express |
| TypeScript | MongoDB + Mongoose |
| Tailwind CSS | JWT + bcrypt |
| React Router | Multer (uploads) |

## 📚 Documentation

- [Full Documentation](DOCUMENTATION.md)
- [Postman Collection](postman_collection.json)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| API 404 | Check `VITE_API_URL` env var |
| Mongo connection | Verify `MONGODB_URI` |
| Image upload fails | Use `FormData` + field name `profileImage` |

## 🙏 Acknowledgments

Built for **Harvee Designs FSD Internship Task**.  
Thanks for the opportunity to showcase full-stack skills!

**Author:** [Budumuru Srinivas Sai Saran Teja]  
**Location:** Visakhapatnam, Andhra Pradesh  
**GitHub:** https://github.com/YOURUSERNAME
