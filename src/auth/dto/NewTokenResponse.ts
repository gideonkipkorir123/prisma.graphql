import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ObjectType()
export class NewTokenResponse {
  @IsNotEmpty()
  @IsString()
  @Field({ description: "AccessToken field" })
  accessToken: string;
  @Field({ description: "Refresh Token field" })
  refreshToken: string;
}
