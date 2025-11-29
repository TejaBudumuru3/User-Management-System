import jwt from 'jsonwebtoken'
// import { UserType } from '../types/users';


export const generateToken = (userid: string ): string => {
    return jwt.sign({userid}, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
    })
}

export const generateRefreshToken = (userid: string): string => {
    return jwt.sign({userid}, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: '7d'
    })
}

export const verifyToken = (token: string): {userid: string} | null => {
  try {
    const values = jwt.verify(token, process.env.JWT_SECRET as string)
    console.log(typeof(values), values instanceof Object ? values.userid : "")
    return {userid: values instanceof Object ? values.userid : values};
  } catch (e) {
    console.log(e instanceof Error ? e.message : "unknown error in token")
    return null;
  }
};
