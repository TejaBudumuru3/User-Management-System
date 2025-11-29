import { UserType } from '../user';  

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: UserType;  // Or { role: string }
    }
  }
}

export {};