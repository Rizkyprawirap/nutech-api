export interface GenerateTokenOptions {
  expiresIn?: string | number;
  jwtid?: string;
}

export interface VerifyTokenResult<T = any> {
  valid: boolean;
  expired: boolean;
  payload?: T;
  error?: string;
}
