import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateSessionInput {
  @Field({ description: "quantity number  (placeholder)" })
  quantity: number;
  @Field({ description: "id field (placeholder)" })
  id: string;
}
