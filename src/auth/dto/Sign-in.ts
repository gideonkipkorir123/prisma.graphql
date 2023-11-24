import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class SignInInput {
  @Field({ description: "email field " })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @Field({ description: "password field" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
