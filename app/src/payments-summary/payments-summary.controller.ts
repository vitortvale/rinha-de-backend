import { Controller, Query, Get } from "@nestjs/common";
import { PaymentsSummaryService } from "./payments-summary.service";

@Controller('payments-summary')
export class PaymentsSummaryController {
  constructor(private paymentsSummaryService: PaymentsSummaryService) { }

  @Get()
  async getSummary(@Query('from') from: String, @Query('to') to: String) {
    return await this.paymentsSummaryService.getSummary(from, to)
  }
}
