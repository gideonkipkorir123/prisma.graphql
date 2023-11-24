import { CreateAuthInput } from "./SignUp";
import { InputType, Field, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateAuthInput extends PartialType(CreateAuthInput) {
  @Field()
  id: string;
}
