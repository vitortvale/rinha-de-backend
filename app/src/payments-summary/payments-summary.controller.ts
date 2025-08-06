import { Controller, Query,Get } from "@nestjs/common";
import { Timestamp } from "rxjs";
import { PaymentsSummaryService } from "./payments-summary.service";

@Controller('payments-summary')
export class PaymentsSummaryController {
    constructor(private paymentsSummaryService: PaymentsSummaryService) {}
    
    @Get()
    async getSummary(@Query('from') from:Date, @Query('to') to:Date) {
        return this.paymentsSummaryService.getSummary(from, to)

    }
}