import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class LOGINDTO {
  @Field({ description: "email field " })
  @IsEmail()
  @IsNotEmpty({ message: "field must not be empty" })
  @IsString({ message: "field must be a string" })
  email: string;
  @Field({ description: "password field" })
  @IsNotEmpty({ message: "field should not be empty" })
  @IsString({ message: "field must be a string" })
  password: string;
}
