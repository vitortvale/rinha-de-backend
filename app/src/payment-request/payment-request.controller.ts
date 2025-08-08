import { Body, Controller, Post, } from "@nestjs/common";
import { PaymentsRequestService } from "./payment-request.service";

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsRequestService: PaymentsRequestService) { }

  @Post()
  async create(@Body() paymentDto: any): Promise<void> {
    await this.paymentsRequestService.addToQueue(paymentDto)
    return
  }

}
