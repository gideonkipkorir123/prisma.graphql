import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { jwtRefreshTokenWithPayload } from "../types/jwt.types";
import { GqlExecutionContext } from "@nestjs/graphql";

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof jwtRefreshTokenWithPayload | undefined,
    context: ExecutionContext,
  ) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (data) {
      console.log(req.user[data], "ID");
      return req.user[data];
    }
    return req.user;
  },
);
