export type UserType = "primary" | "secondary";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  mobile: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface SignupData {
  full_name: string;
  mobile: string;
  email: string;
  password: string;
  user_type: UserType;
}

export interface LoginData {
  email: string;
  password: string;
}