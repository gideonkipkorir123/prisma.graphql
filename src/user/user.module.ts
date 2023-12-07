import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [
    UserResolver,
    UserService,
    PrismaService,
    JwtModule,
    JwtService,
    ConfigService,
  ],
})
export class UserModule {}
