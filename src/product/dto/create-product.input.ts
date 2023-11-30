import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateProductInput {
  @Field({ defaultValue: 0, description: "Product number field" })
  price: number;
  @Field({ description: "Product price quantity field" })
  quantity: number;
  @Field({ description: "Product name field " })
  name: string;
  @Field({ description: "Products brand field" })
  brand: string;
  @Field({ description: "Product brand field " })
  image: string;
}
