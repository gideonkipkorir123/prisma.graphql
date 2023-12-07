import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthInput } from "./dto/SignUp";
import { UpdateAuthInput } from "./dto/update-auth.input";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { SignInInput } from "./dto/Sign-in";
import { Request, Response } from "express";
import { User } from "@prisma/client";
import { LOGINDTO } from "./dto/SIGNIN.dto";
import { RegisterDto } from "./dto/Register.dto";

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
      throw new ForbiddenException("Access Denied since the users don't match");
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

  // WE CREATE A NEW PROJECT TO TAKE IN REFRESHTOKENS FROM COOKIES
  async DoRefreshToken(req: Request, res: Response) {
    const refreshedTokens = req.cookies["refresh_token"];
    if (!refreshedTokens) {
      throw new UnauthorizedException("NOT AUTHORIZED");
    }
    let payload;
    try {
      payload = this.jwtService.verify(refreshedTokens, {
        secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      });
    } catch (error) {
      throw new UnauthorizedException("Invalid or Tokens Expired");
    }
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!userExists) {
      throw new BadRequestException("USER DOESN'T EXIST");
    }
    const expiresIn = 15000;
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = this.jwtService.sign(
      { ...payload, exp: expiration },
      {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
      },
    );
    res.cookie("access_token", accessToken, { httpOnly: true });
    return accessToken;
  }
  private async issueToken(user: User, res: Response) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get("ACCESS_TOKEN_SECRET"),
        expiresIn: "1500sec",
      },
    );
    const refreshToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get("REFRESH_TOKEN_SECRET"),
        expiresIn: "7d",
      },
    );
    res.cookie("access_token", accessToken, { httpOnly: true });
    res.cookie("access_token", refreshToken, { httpOnly: true });
    return { user };
  }
  async validateUser(login: LOGINDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: login.email,
      },
    });
    if (!user) {
      throw new ForbiddenException(
        "Access Denied since the user doesn't exist",
      );
    }
    const passwordMatch = await argon2.verify(
      user.hashedPassword,
      login.password,
    );
    if (!passwordMatch) {
      throw new ForbiddenException(
        "Access Denied because the passwords don't match!",
      );
    }
    if (user) {
      return { user };
    } else return null;
  }
  async RegisterUser(register: RegisterDto, res: Response) {
    const ExistingUser = await this.prisma.user.findUnique({
      where: {
        email: register.email,
      },
    });
    if (ExistingUser) {
      throw new BadRequestException({
        email: "Email already exists ",
      });
    }
    const hashedPassword = await argon2.hash(register.hashedPassword);

    const user = await this.prisma.user.create({
      data: {
        email: register.email,
        hashedPassword,
        username: register.username,
      },
    });
    return this.issueToken(user, res);
  }
  async LOGIN(login: LOGINDTO, res: Response) {
    const user = this.validateUser(login);
    if (!user) {
      throw new BadRequestException({
        message: "please enter correct details",
        invalidCredentials: "credentials dont match",
      });
    }
    return this.issueToken((await user).user, res);
  }
  async logout(res: Response) {
    res.clearCookie("access_cookies");
    res.clearCookie("refresh_cookies");
    return "successfly logged out";
  }
}
