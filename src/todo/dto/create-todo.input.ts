import { InputType, Field } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class CreateTodoInput {
  @Field({ description: "input todo title" })
  @IsString()
  title: string;

  @Field({ description: "input todo description" })
  @IsString()
  description: string;
}
