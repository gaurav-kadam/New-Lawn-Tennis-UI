export interface Official {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  gender: string;
  state: string;
  city: string;
  is_active?: boolean;
}