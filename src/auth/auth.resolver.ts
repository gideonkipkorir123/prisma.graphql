import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";
import { CreateAuthInput } from "./dto/SignUp";
import { UpdateAuthInput } from "./dto/update-auth.input";
import { SignResponse } from "./dto/SignResponse";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  signUp(@Args("createAuthInput") createAuthInput: CreateAuthInput) {
    return this.authService.signUp(createAuthInput);
  }

  @Query(() => [Auth], { name: "auth" })
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => Auth, { name: "auth" })
  findOne(@Args("id", { type: () => Int }) id: string) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args("updateAuthInput") updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args("id", { type: () => Int }) id: string) {
    return this.authService.remove(id);
  }
}
