import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field({ nullable: true, description: "id field description" })
  id?: string;

  @Field({ description: "username field description" })
  username: string;

  @Field()
  email?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
