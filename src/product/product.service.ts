/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  create(createProductInput: CreateProductInput) {
    return this.prisma.products.create({
      data: {
        brand: createProductInput.brand,
        image: createProductInput.image,
        price: createProductInput.price,
        name: createProductInput.name,
        quantity: createProductInput.quantity,
      },
    });
  }

  findAll() {
    return this.prisma.products.findMany();
  }

  findOne(id: string) {
    return this.prisma.products.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, _updateProductInput: UpdateProductInput) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
