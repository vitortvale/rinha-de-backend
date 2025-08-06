import { Injectable } from "@nestjs/common";
import { PaymentRequestDto } from "./dto/create-payment-request.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class PaymentsRequestService {
    constructor(@InjectQueue('payments')  
                private readonly queueService: Queue) {}

    async addtoqueue(paymentRequestDto: PaymentRequestDto) {
        await this.queueService.add('payments', paymentRequestDto)
    }
}
