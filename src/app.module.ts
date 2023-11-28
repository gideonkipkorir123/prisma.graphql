import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { TodoModule } from "./todo/todo.module";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuards } from "./auth/guard/accessToken.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      buildSchemaOptions: { dateScalarMode: "timestamp" },
      autoSchemaFile: join(process.cwd(), "src/schema.graphql"),
      sortSchema: true,
    }),
    TodoModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: AccessTokenGuards },
  ],
})
export class AppModule {}
