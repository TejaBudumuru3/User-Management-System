import mongoose, { Schema } from "mongoose";
import { UserType } from "../types/users";

const UserRole = ['user', 'admin'];

const userSchema = new Schema<UserType>({
  name: { type: String, required: true, minlength: 3, match: /^[a-zA-Z\s]+$/ },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, match: /^\d{10,15}$/ },
  password: { type: String, required: true, minlength: 6 },
  profileImage: { type: String },
  address: { type: String, maxlength: 150 },
  state: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true, match: /^\d{4,10}$/ },
  role: { type: String, enum: UserRole, default: 'user' }
}, 
{
  timestamps: true 
});

export default mongoose.model<UserType>('User',userSchema);