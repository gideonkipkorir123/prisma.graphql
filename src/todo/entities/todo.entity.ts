import { ObjectType, Field, ID } from "@nestjs/graphql";
import { DateScalar } from "../Scalar/date.scalar";
import { IsDate, IsNotEmpty } from "class-validator";

@ObjectType()
export class Todo {
  @Field(() => ID, { description: "string field" })
  id: string;
  @Field(() => Date, { description: "string field" })
  createdAt: DateScalar;
  @IsNotEmpty()
  @IsDate()
  @Field({ description: "Example field (placeholder)" })
  title: string;
  @Field({ description: "Example field (placeholder)" })
  description: string;
}
