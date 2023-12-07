import { CreateUserInput } from "./create-user.input";
import { InputType, Field, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ description: "updates a user by id" })
  id: string;
  @Field({ description: "updates a username" })
  username: string;
}
