import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { Product } from "./entities/product.entity";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { Public } from "src/auth/decorators/public.decoratots";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}
  @Public()
  @Mutation(() => Product)
  createProduct(
    @Args("createProductInput") createProductInput: CreateProductInput,
  ) {
    return this.productService.create(createProductInput);
  }
  @Public()
  @Query(() => [Product], { name: "products" })
  findAll() {
    return this.productService.findAll();
  }
  @Public()
  @Query(() => Product, { name: "product" })
  findOne(@Args("id") id: string) {
    return this.productService.findOne(id);
  }
  @Public()
  @Mutation(() => Product)
  updateProduct(
    @Args("updateProductInput") updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }
  @Public()
  @Mutation(() => Product)
  removeProduct(@Args("id") id: string) {
    return this.productService.remove(id);
  }
}
