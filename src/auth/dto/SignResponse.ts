import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/userEntity";

@ObjectType()
export class SignResponse {
  @IsNotEmpty()
  @IsString()
  @Field({ description: "AccessToken field" })
  accessToken: string;
  @Field({ description: "AccessToken field" })
  refreshToken: string;
  @Field(() => User)
  user: User;
}
