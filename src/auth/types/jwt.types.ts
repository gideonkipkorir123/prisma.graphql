export type JwtPayload = {
  userId: string;
  email: string;
};

export type jwtRefreshTokenWithPayload = JwtPayload & {
  refreshToken: string;
};
