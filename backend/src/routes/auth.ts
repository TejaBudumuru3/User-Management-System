import { loginUser, registerUser } from "../controllers/authController";
import { Router } from "express";
import { uploadProfile } from "../middleware/upload";

const authRouter = Router()

authRouter.post('/register', uploadProfile, registerUser)
authRouter.post('/login', loginUser)

export default authRouter