export interface JwtPayload {
  user_id: string;
  email: string;
  iat?: number;
  exp?: number;
}
