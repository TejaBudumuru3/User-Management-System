import { Response, Request, NextFunction } from "express";

export function requiredRole(role: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user || !role.includes(req.user.role)){
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        next();
    }
}