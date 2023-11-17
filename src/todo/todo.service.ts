import { Injectable } from "@nestjs/common";
import { CreateTodoInput } from "./dto/create-todo.input";
import { UpdateTodoInput } from "./dto/update-todo.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  async create(createTodoinput: CreateTodoInput) {
    return await this.prisma.todo.create({
      data: {
        title: createTodoinput.title,
        description: createTodoinput.description,
      },
    });
  }

  async findAll() {
    return await this.prisma.todo.findMany({});
  }

  findOne(id: string) {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTodoInput: UpdateTodoInput) {
    return await this.prisma.todo.update({
      where: { id },
      data: {
        ...updateTodoInput,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.todo.delete({
      where: { id },
    });
  }
}
