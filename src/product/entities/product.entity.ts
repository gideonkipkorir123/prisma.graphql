import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class Product {
  @Field({ defaultValue: 0, description: "Product number field" })
  price: number;
  @Field({ description: "Product name field " })
  name: string;
  @Field({ description: "Products brand field " })
  brand: string;
  @Field({ description: "Product image field" })
  image: string;
  @Field({ description: "Product quantity field" })
  quantity: number;
}
