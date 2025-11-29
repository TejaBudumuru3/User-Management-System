import User from "../models/User";
import { CreateUserInput, UserType } from "../types/users";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { generateRefreshToken, generateToken } from "../utils/token";

export async function registerUser(req: Request<{},CreateUserInput>, res: Response) {
    try{
        const {
            name,
            email,
            phone,
            password,
            address,
            state,
            city,
            country,
            pincode
        } = req.body;

        const existing = await User.findOne({ $or: [{email}, {phone}]})
        
        if(existing) 
            return res.status(400).json({
        message: "user already registered please login"})

        const hashed = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            phone,
            password: hashed,
            address,
            state,
            city,
            country,
            pincode,
            role: 'user'
        })

        if (req.file) {
            user.profileImage = `/uploads/${req.file.filename}`;
        }


        await user.save();
        res.status(201).json({
            message: "user registered successfully!"
        })
    }
    catch(e){
        res.status(500).json({
            message: `Failed to register the user ${e instanceof Error ? e.message : "unknown error"}`
        })
    }
}

export async function loginUser(req: Request, res: Response){
    try{
        const { user, password } = req.body;

        if( !user || !password) return res.status(400).json({
            message: `email/phone or password required!!! ${user}, ${password}`
        })

        const dbUser = await User.findOne({
            $or:[{email: user}, {phone: user}]
        });

        if( !dbUser || !(await bcrypt.compare(password, dbUser.password))){
            return res.status(401).json({
                message: 'invalid credentials'
            });
        }

        const accessToken = generateToken(dbUser._id);
        const refreshToken = generateRefreshToken(dbUser._id)
        const {password: pass, ...userResponse} = dbUser.toObject()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login Success!",
            accessToken: accessToken,
            user: userResponse
        });
    }
    catch(e){
        return res.status(500).json({
            message: `something went wrong: ${e instanceof Error ? e.message : "unknown error"}`
        })
    }
}