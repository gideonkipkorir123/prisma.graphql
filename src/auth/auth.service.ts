import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateAuthInput } from "./dto/SignUp";
import { UpdateAuthInput } from "./dto/update-auth.input";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { SignInInput } from "./dto/Sign-in";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(createAuthInput: CreateAuthInput) {
    const hashedPassword = await argon2.hash(createAuthInput.hashedPassword);
    const user = await this.prisma.user.create({
      data: {
        username: createAuthInput.username,
        email: createAuthInput.email,
        hashedPassword,
      },
    });
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshTokenHashed(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async SigIn({ signIn }: { signIn: SignInInput }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signIn.email,
      },
    });
    if (!user) {
      throw new ForbiddenException("Access Denied!");
    }
    const passwordMatch = await argon2.verify(
      user.hashedPassword,
      signIn.password,
    );
    if (!passwordMatch) {
      throw new ForbiddenException("Access Denied!");
    }
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshTokenHashed(user.id, user.email);
    return { accessToken, refreshToken, user };
  }

  findOne(id: string) {
    return `This action returns a #${id} auth`;
  }
  async logOut(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    return {
      loggedOut: true,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, _updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  async getNewTokens(userId: string, refToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ForbiddenException("Access Denied since the users dont match");
    }
    const doRefreshToken = await argon2.verify(
      user.hashedRefreshToken,
      refToken,
    );
    if (!doRefreshToken) {
      throw new ForbiddenException("Access Denied");
    }
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshTokenHashed(userId, refreshToken);
    return { accessToken, refreshToken, user };
  }
  async createToken(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: "10s",
        secret: this.configService.get("ACCESS_TOKEN_SECRET"),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: "7d",
        secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      },
    );
    return { accessToken, refreshToken };
  }
  async updateRefreshTokenHashed(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRefreshToken,
      },
    });
  }
}
