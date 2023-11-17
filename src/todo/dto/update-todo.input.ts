import { CreateTodoInput } from "./create-todo.input";
import { InputType, Field, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @Field({ description: "update to do input  (placeholder)" })
  id: string;
}
