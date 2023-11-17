import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { TodoModule } from "./todo/todo.module";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      buildSchemaOptions: { dateScalarMode: "timestamp" },
      autoSchemaFile: join(process.cwd(), "src/schema.graphql"),
      sortSchema: true,
    }),
    TodoModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
