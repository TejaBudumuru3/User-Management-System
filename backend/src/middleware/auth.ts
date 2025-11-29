import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";
import User from "../models/User";

export async function authenticateToken(req: Request ,res: Response, next: NextFunction): Promise <void> {
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(" ")[1] : null;

        if(!token){
            res.status(401).json({
                message: `Access token required`
            })
            return
        }

        const decoded = verifyToken(token);
        console.log("decoded", decoded?.userid)
        if(!decoded){
            res.status(401).json({
                message: `invalid token`
            })
            return
        }

        const data = await User.findOne({_id: decoded.userid}).select('role') as {_id: string, role: string};
        const user = data ? {
            userid : data._id.toString(),
            role: data.role
        }: null
        console.log(user)
        req.user = user;
        next();
    }
    catch(e){
        res.status(500).json({
            message: `Auth Error: ${e instanceof Error ? e.message : ""}`
        })
    }
}