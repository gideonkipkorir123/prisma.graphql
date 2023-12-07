import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";

@ObjectType()
export class SignResponse {
  @Field({ description: "AccessToken field" })
  accessToken: string;
  @Field({ description: "AccessToken field" })
  refreshToken: string;
  @Field(() => User)
  user: User;
}
