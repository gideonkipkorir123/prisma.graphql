import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";
import { CreateAuthInput } from "./dto/SignUp";
import { UpdateAuthInput } from "./dto/update-auth.input";
import { SignResponse } from "./dto/SignResponse";
import { SignInInput } from "./dto/Sign-in";
import { LogOutResponse } from "./dto/logout-Response";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  signUp(@Args("createAuthInput") createAuthInput: CreateAuthInput) {
    return this.authService.signUp(createAuthInput);
  }

  @Mutation(() => SignResponse)
  signIn(@Args("signininput") signininput: SignInInput) {
    return this.authService.SigIn({ signIn: signininput });
  }

  @Query(() => Auth, { name: "auth" })
  findOne(@Args("id", { type: () => Int }) id: string) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args("updateAuthInput") updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => LogOutResponse)
  logout(@Args("id") id: string) {
    return this.authService.logOut(id);
  }
}
