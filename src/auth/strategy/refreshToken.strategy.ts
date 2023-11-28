import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload, jwtRefreshTokenWithPayload } from "../types/jwt.types";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-Refresh",
) {
  constructor(public config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("REFRESH_TOKEN_SECRET"),
      passRequestToCallBack: true,
    });
  }
  async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<jwtRefreshTokenWithPayload> {
    const refreshToken = req?.headers?.authorization
      ?.replace("Bearer", "")
      .trim();
    console.log(payload, "payload");
    return { ...payload, refreshToken };
  }
}
