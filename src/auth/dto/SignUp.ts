import { InputType, Field } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

@InputType()
export class CreateAuthInput {
  @Field({ description: "username field  (placeholder)" })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
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
