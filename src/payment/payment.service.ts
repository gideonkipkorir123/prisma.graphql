import { Injectable } from "@nestjs/common";
import { CreatePaymentInput } from "./dto/create-payment.input";
import { UpdatePaymentInput } from "./dto/update-payment.input";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.get("STRIPE_PRIVATE"), {
      apiVersion: "2023-10-16",
    });
  }
  async createCheckOutSession(items: { id: string; quantity: number }[]) {
    const storedItems = await Promise.all(
      items.map(async (item) => {
        const storedItem = this.prisma.products.findUnique({
          where: {
            id: item.id,
          },
        });
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: (await storedItem).name,
            },
            unit_amount: (await storedItem).price * 100,
          },
          quantity: (await storedItem).quantity,
        };
      }),
    );
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: storedItems,
      success_url: "http://localhost:3300/success",
      cancel_url: "http://localhost:3300/cancel",
    });
    return {
      url: session.url,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createPaymentInput: CreatePaymentInput) {
    return "This action adds a new payment";
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updatePaymentInput: UpdatePaymentInput) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
