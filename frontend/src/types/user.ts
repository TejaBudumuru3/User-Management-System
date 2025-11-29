export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  profileImage?: string;
  role: 'admin' | 'user';
}
