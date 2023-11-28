import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
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
  signIn(@Args("signininput") signininput: SignInInput) {
    return this.authService.SigIn({ signIn: signininput });
  }
  @Public()
  @Query(() => Auth, { name: "auth" })
  findOne(@Args("id", { type: () => Int }) id: string) {
    return this.authService.findOne(id);
  }
  @Public()
  @Query(() => String)
  hello() {
    return "hello there";
  }

  @Mutation(() => Auth)
  updateAuth(@Args("updateAuthInput") updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }
  @Public()
  @Mutation(() => LogOutResponse)
  logout(@Args("id") id: string) {
    return this.authService.logOut(id);
  }
  @Public()
  @UseGuards(RefreshTokenGuards)
  @Mutation(() => NewTokenResponse)
  getNewTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }
}
