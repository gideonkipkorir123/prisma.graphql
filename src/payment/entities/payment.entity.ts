import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Payment {
  @Field(() => Int, { description: "Example field (placeholder)" })
  quantity: number;
  @Field({ description: "Example field (placeholder)" })
  id: string;
}
