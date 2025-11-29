import { Request, Response } from "express";
import User from "../models/User";


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    
    const skip = (page - 1) * limit;
    
    const query: any = search 
      ? { 
          $or: [
            { name: { $regex: search, $options: 'i' } }, 
            { email: { $regex: search, $options: 'i' } }
          ] 
        }
      : {};
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    res.json({ 
      users, 
      total, 
      page, 
      pages: Math.ceil(total / limit) 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    console.log((req.user))
    
    const user = await User.findById((req.user as any).userid).select('-password');
    console.log(user)
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalCities, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.distinct('city'),
      User.find().select('name email createdAt').sort({ createdAt: -1 }).limit(6)
    ]);
    
    res.json({ 
      totalUsers, 
      totalCities: totalCities.length, 
      recentUsers 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};


export async function getUserById(req: Request, res: Response){
    try{
        const id  = req.params.id;

        if(id){
            const user = await User.findById(id).select('-password')
            
            if(!user){
                return res.status(404).json({
                    message: 'User not found'   
                })
            }
            res.status(200).json({
                user: user
            })
        }
        else
            return res.status(404).json({
                message: 'user Id not provided'   
            })
    }
    catch(e){
        res.status(500).json({
            message: `failed to fetch user: ${e instanceof Error ? e.message : "Unkown error"}`
        })
    }
}

export async function updateUser(req: Request, res: Response){
    try{
         
        const id  = req.params.id;

        if(!id){
           return res.status(404).json({
                message: 'user Id not provided'   
            })
        }

        if (req.file) {
            req.body.profileImage = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(id, req.body, {new: true}).select('-password')

        if(!user){
            return res.status(404).json({
                message: 'User not found'   
            })
        }
        res.status(201).json({
            message: `${user?.email} User updated`
        })
    }
    catch(e){
        res.status(500).json({
            message: `failed to update user: ${e instanceof Error ? e.message : "Unkown error"}`
        })
    }

}

export async function deleteUser(req: Request, res: Response) {
    try{
        const id = req.params.id;
        if(!id){
            return res.status(404).json({
                message: 'user Id not provided'
            })
        }
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({
                message: 'User not found'   
            })
        }
        await User.findByIdAndDelete(id)
        res.status(201).json({
            message: `${id} -  User deleted successfully`
        })
    }
    catch(e){
         res.status(500).json({
            message: `failed to delete user: ${e instanceof Error ? e.message : "Unkown error"}`
        })
    }
}