export interface IUser {
  uid: string;
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  password: string;
  phone_code: string;
  phone: string;
  verified?: boolean;
}
