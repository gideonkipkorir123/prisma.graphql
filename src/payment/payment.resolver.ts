import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PaymentService } from "./payment.service";
import { Payment } from "./entities/payment.entity";
// import { CreatePaymentInput } from "./dto/create-payment.input";
import { UpdatePaymentInput } from "./dto/update-payment.input";
import { CreateSessionInput } from "./dto/create-session-input";
import { CreateSessionResponse } from "./dto/create-session-response";
import { Public } from "src/auth/decorators/public.decoratots";

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}
  @Public()
  @Mutation(() => CreateSessionResponse)
  createSessionInput(
    @Args({ name: "items", type: () => [CreateSessionInput] })
    createsessionInput: CreateSessionInput[],
  ) {
    return this.paymentService.createCheckOutSession(createsessionInput);
  }

  @Query(() => [Payment], { name: "payment" })
  findAll() {
    return this.paymentService.findAll();
  }

  @Query(() => Payment, { name: "payment" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.paymentService.findOne(id);
  }

  @Mutation(() => Payment)
  updatePayment(
    @Args("updatePaymentInput") updatePaymentInput: UpdatePaymentInput,
  ) {
    return this.paymentService.update(
      updatePaymentInput.id,
      updatePaymentInput,
    );
  }

  @Mutation(() => Payment)
  removePayment(@Args("id", { type: () => Int }) id: number) {
    return this.paymentService.remove(id);
  }
}
