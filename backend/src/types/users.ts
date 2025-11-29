// Input for registration (strict, no auto-fields)
export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
}

// Full user from DB (for responses)
export interface UserType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  password: string
  state: string;
  city: string;
  country: string;
  pincode: string;
  profileImage?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
