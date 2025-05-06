export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserInfo {
  id: number;
  username: string;
  roles: string[];
}
