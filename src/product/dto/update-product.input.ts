import { CreateProductInput } from "./create-product.input";
import { InputType, Field, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field({ description: "update product id input  (placeholder)" })
  id: string;
}
