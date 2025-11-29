import multer from "multer";
import path from "path";
import fs from 'fs'

if(!fs.existsSync('./uploads'))
    fs.mkdirSync('./uploads', { recursive: true})

const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

export const uploadProfile = multer({
    storage,
    limits: {fileSize: 2 * 1024 *1024},
    fileFilter: (req, file, cb) => {
        console.log('File received:', file.fieldname, file.originalname);
        if(file.mimetype.startsWith('image/')) {
            return cb(null, true);
        }
        return cb(new Error('JPG/PNG only'));
    }
}).single('profileImage')