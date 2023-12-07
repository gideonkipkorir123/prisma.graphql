import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CreateSessionResponse {
  @Field({ description: "URL session return  (placeholder)" })
  url: string;
}
