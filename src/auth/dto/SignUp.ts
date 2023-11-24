import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateAuthInput {
  @Field({ description: "username field  (placeholder)" })
  @IsNotEmpty()
  @IsString()
  username: string;
  @Field({ description: "email field (placeholder)" })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @Field({ description: "password field" })
  @IsNotEmpty()
  @IsString()
  hashedPassword: string;
}
