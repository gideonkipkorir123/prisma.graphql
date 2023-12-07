/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { UpdateUserInput } from "./dto/update-user.input";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserInput } from "./dto/create-user.input";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  create(createUserInput: CreateUserInput) {
    return "This action adds a new user";
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateUser(userId: string, avatarUrl: string, username: string) {
    if (avatarUrl) {
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username,
          avatarUrl,
        },
      });
    }
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl,
        username,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
