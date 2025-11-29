# Project Documentation – MERN User Management System

This project is a small user management system built with a typical MERN-style stack: React + TypeScript on the frontend, Node/Express + MongoDB on the backend, and JWT for authentication. The goal was to build something that looks and behaves like a real-world admin panel, but still stays simple enough to understand in one sitting.

The main features are: authentication, role-based access control (RBAC), profile image upload, server-side pagination, and a Docker setup so the whole thing can be started with a single command.

---

## 1. Tech Stack

**Frontend**
- React + TypeScript  
- Tailwind CSS for styling  
- Axios (or similar) for API calls  
- React Router for routing

**Backend**
- Node.js + Express (TypeScript)  
- MongoDB with Mongoose  
- JWT for authentication  
- Multer for handling image uploads

**Other**
- Docker & docker-compose for local environment  
- Postman collection for API testing

The idea was to keep the stack familiar and straightforward, without adding extra layers like Next.js or complex infrastructure.

---

## 2. Core Features

### 2.1 Authentication & Roles

The app supports user registration and login. Login is done using a generic `user` field which can be either email or phone, plus a password. On successful login, the backend returns a JWT access token.

Roles:
- `admin` – has access to the full users list and can edit/delete users.
- `user` – can only see their own profile via `/users/me` and gets a simpler dashboard.

The frontend checks the logged-in user’s role and decides which dashboard view to show. Admins see the full management table, and normal users see a profile-style page.

---

### 2.2 User Management (Admin)

The admin dashboard exposes:

- A paginated list of users.
- Basic search by name or email.
- Options to edit user details (including updating profile image).
- Option to delete a user.

The corresponding backend route is `GET /users` with query params:
- `page`
- `limit`
- `search`

The backend calculates `skip`, returns the user list plus `total` and `pages`, and the frontend uses that to render pagination controls.

---

### 2.3 Public Stats

There is a public stats endpoint:

- `GET /users/stats`

This returns high-level statistics (like total users, distinct cities, and some recent users). No authentication is required for this route. It is used on the public home page to show some basic numbers even for non-logged-in visitors.

Initially, there was a mistake where this route was behind auth middleware, but that was fixed by explicitly exposing `/stats` as a public route before the protected ones.

---

### 2.4 Profile Image Upload

One of the key pieces of functionality is profile image upload, both during registration and when editing a user.

- On the frontend, the registration form uses `FormData` to send text fields plus the image file.
- On the backend, Multer is used: `uploadProfile.single('profileImage')`, and the file path is stored in the `profileImage` field for that user.
- The admin user table displays either the uploaded image or a “No Image” placeholder.

This was one of the newer parts for this project. The tricky bit was making sure the field name in `FormData` matched the one expected by Multer (`profileImage`), and remembering that once you use `FormData`, you should not manually set the `Content-Type` to `application/json`.

---

### 2.5 Pagination

The user listing is paginated on the server side, not just filtered on the client.

Backend:
- Accepts `page`, `limit`, and `search` as query params.
- Builds a Mongoose query based on `search` (matching name or email).
- Uses `skip` and `limit` to fetch only the relevant slice.
- Returns:
  - `users` (current page)
  - `total` (count of all matching users)
  - `page`
  - `pages` (total page count)

Frontend:
- Keeps `page`, `pages`, `total`, and `search` in state.
- Re-fetches data when page or search changes.
- Shows “Showing X to Y of Z users” and previous/next buttons plus numbered page buttons.

Getting this wired up end-to-end with search and state updates was a good exercise.

---

## 3. API Overview

Base URL (local):  
`http://localhost:3000/api`

### 3.1 Auth

**POST `/auth/register`**  
Registers a new user, including optional profile image if using multipart/form-data.

**POST `/auth/login`**  
Body:
{
"user": "email-or-phone",
"password": "Password@123"
}

Returns an `accessToken` which is used for authenticated requests.

---

### 3.2 Public

**GET `/users/stats`**  
Returns public stats. No token required.

---

### 3.3 User

**GET `/users/me`**  
Returns the currently logged-in user, based on the JWT. Requires `Authorization: Bearer <token>` header.

---

### 3.4 Admin

**GET `/users`**  
Query params: `page`, `limit`, `search`  
Returns paginated list of users. Admin only.

**PUT `/users/:id`**  
Updates user details (and can also handle a profile image if multipart is used). Admin only.

**DELETE `/users/:id`**  
Deletes a user. Admin only.

---

## 4. Docker & Local Setup

The project includes a `docker files` in both frontend and backend folders that starts:

- Backend container
- Frontend container 

## 5. Postman Collection

There is a Postman collection that covers:

- Register
- Login (with a small test script that saves the access token to an environment variable)
- Public stats
- Get current user (`/users/me`)
- Admin routes for listing, updating, and deleting users

This makes it easy to verify the backend without going through the UI every time.

Typical flow for a tester:
1. Call **Register**.
2. Call **Login** – this stores `accessToken` in Postman.
3. Call **/users/me**.
4. If logged in as admin, call **/users**, **PUT /users/:id**, and **DELETE /users/:id**.

---

## 6. Things That Took Time / Lessons Learned

Two areas took a bit of time to get right:

1. **Multer Image Upload**  
   Understanding how `FormData` on the frontend and `req.file` on the backend fit together was a useful learning point. Once the field names matched and the route used the correct Multer middleware, it worked reliably.

2. **Pagination Logic**  
   Combining `page`, `limit`, `search`, the Mongoose query, and the frontend UI state was slightly fiddly at first. After wiring it once, the pattern becomes reusable.

Another small lesson was around JWT payloads and MongoDB IDs. The token was originally using a `userid` field, while other parts of the code expected `_id`. Mapping this correctly in the auth middleware, and remembering that Mongoose is fine with string IDs in `findById`, helped avoid “Cast to ObjectId failed” errors.

Overall, this project tied together RBAC, image upload, pagination, JWT auth, and Docker into one small but fairly complete example of a user management system.