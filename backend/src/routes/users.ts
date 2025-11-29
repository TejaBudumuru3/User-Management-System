import { getAllUsers, getUserById, updateUser, deleteUser, getUserStats, getCurrentUser } from "../controllers/userController";

import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { requiredRole } from "../middleware/rbac";
import { uploadProfile } from "../middleware/upload";

const userRouter = Router()

userRouter.get('/stats', getUserStats); 
userRouter.get('/me', authenticateToken, getCurrentUser);

userRouter.get('/', authenticateToken, requiredRole(['admin']), getAllUsers);
userRouter.route('/:id').get(authenticateToken, getUserById)
        .put(authenticateToken, uploadProfile, updateUser)
        .delete(authenticateToken, requiredRole(['admin']), deleteUser)


// Admin protected
userRouter.get('/', authenticateToken, requiredRole(['admin']), getAllUsers);
export default userRouter