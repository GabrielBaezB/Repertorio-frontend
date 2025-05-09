export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken:  string;   // ← muy importante el nombre
  refreshToken: string | null;
}

export interface UserInfo {
  id: number;
  username: string;
  roles: string[];
}
