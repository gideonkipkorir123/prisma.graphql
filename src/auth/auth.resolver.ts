import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { CreateAuthInput } from "./dto/SignUp";
import { UpdateAuthInput } from "./dto/update-auth.input";
import { SignResponse } from "./dto/SignResponse";
import { SignInInput } from "./dto/Sign-in";
import { LogOutResponse } from "./dto/logout-Response";
import { GetCurrentUser } from "./decorators/CurrentUser.decorator";
import { GetCurrentUserId } from "./decorators/CurrentUserId.decorator";
import { NewTokenResponse } from "./dto/NewTokenResponse";
import { Public } from "./decorators/public.decoratots";
import { UseGuards } from "@nestjs/common/decorators";
import { RefreshTokenGuards } from "./guard/refreshToken.guard";
import { Auth } from "./entities/auth.entity";
import { AccessTokenGuards } from "./guard/accessToken.guard";
import { RegisterDto } from "./dto/Register.dto";
import { Response, Request } from "express";
import { BadRequestException } from "@nestjs/common";
import { LOGINDTO } from "./dto/SIGNIN.dto";
import {
  LoginResponse,
  RegisterResponse,
} from "./entities/register-response.entity";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Mutation(() => SignResponse)
  signUp(@Args("createAuthInput") createAuthInput: CreateAuthInput) {
    return this.authService.signUp(createAuthInput);
  }
  @Public()
  @Mutation(() => SignResponse)
  @UseGuards(AccessTokenGuards)
  async signIn(@Args("signininput") signininput: SignInInput) {
    return this.authService.SigIn({ signIn: signininput });
  }
  @Public()
  @Query(() => Auth, { name: "auth" })
  async findOne(@Args("id", { type: () => Int }) id: string) {
    return this.authService.findOne(id);
  }
  @Public()
  @Query(() => String)
  async hello() {
    return "hello there";
  }

  @Mutation(() => Auth)
  async updateAuth(@Args("updateAuthInput") updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }
  @Public()
  @Mutation(() => LogOutResponse)
  async logout(@Args("id") id: string) {
    return this.authService.logOut(id);
  }
  @Public()
  @UseGuards(RefreshTokenGuards)
  @Mutation(() => NewTokenResponse)
  async getNewTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }

  ///USE OF COOKIES AND TOKENS PROJECT
  @Mutation(() => RegisterResponse)
  async register(
    @Args("registerInput") registerDto: RegisterDto,
    @Context() context: { res: Response },
  ) {
    if (registerDto.hashedPassword !== registerDto.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: "Password and confirm password are not the same.",
      });
    }
    const { user } = await this.authService.RegisterUser(
      registerDto,
      context.res,
    );
    return { user };
  }
  @Mutation(() => LoginResponse)
  async login(
    @Args("loginUser") loginDto: LOGINDTO,
    @Context() context: { res: Response },
  ) {
    return this.authService.LOGIN(loginDto, context.res);
  }
  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    try {
      return this.authService.DoRefreshToken(context.req, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
