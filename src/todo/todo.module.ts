import { Module } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoResolver } from "./todo.resolver";
import { PrismaService } from "src/prisma/prisma.service";
import { DateScalar } from "./Scalar/date.scalar";

@Module({
  providers: [TodoResolver, TodoService, PrismaService, DateScalar],
})
export class TodoModule {}
