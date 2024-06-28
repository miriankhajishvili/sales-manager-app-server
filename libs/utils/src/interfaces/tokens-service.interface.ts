export interface IJwtConfig {
  secret: string;
  expiresIn: string;
}

export interface ITokenService {
  signToken(payload: object, config?: IJwtConfig): Promise<string>;
}
