import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { TodoModule } from "./todo/todo.module";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuards } from "./auth/guard/accessToken.guard";
import { ProductModule } from "./product/product.module";
import { PaymentModule } from "./payment/payment.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (config: ConfigService) => {
        return {
          cors: {
            origin: config.get("CLIENT_URL"),
          },
          autoSchemaFile: join(process.cwd(), "SCHEMA_URL"),
          sortSchema: true,
          playground: true,
        };
      },
      inject: [ConfigService],
    }),
    TodoModule,
    AuthModule,
    UserModule,
    ProductModule,
    PaymentModule,
  ],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: AccessTokenGuards },
  ],
})
export class AppModule {}
