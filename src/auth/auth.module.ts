import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategy/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategy/refreshToken.strategy";

@Module({
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    JwtService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
