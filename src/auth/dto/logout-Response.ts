import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class LogOutResponse {
  @Field({ description: "Example field (placeholder)" })
  loggedOut: boolean;
}
