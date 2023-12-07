import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}
@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;
}
