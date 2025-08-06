import { Injectable } from "@nestjs/common";
import { PaymentRequestDto } from "./dto/create-payment-request.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PaymentProcessorRequestDto } from "src/payment-processor-request/dto/create-payment-processor-request.dto";

@Injectable()
export class PaymentsRequestService {
    constructor(@InjectQueue('payments')  
                private readonly queueService: Queue) {}

    async addtoqueue(paymentRequestDto: PaymentRequestDto) {

        const correlationId = paymentRequestDto.correlationId
        const amount = paymentRequestDto.amount
        const requestedAt = new Date().toISOString()

        const rawPaymentProcessorRequestDto = {
        correlationId,
        amount,
        requestedAt,
        }

        const paymentProcessorRequestDto = PaymentProcessorRequestDto.create(
        rawPaymentProcessorRequestDto
        )

        await this.queueService.add('payments', paymentProcessorRequestDto)
    }
}
