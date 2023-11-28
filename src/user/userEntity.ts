import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field({ description: "AccessToken filed (placeholder)"})
  id: string;
  @Field({ description: "AccessToken filed (placeholder)" })
  username: string;
  @Field()
  email: string;
}
