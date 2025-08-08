import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class PaymentsRequestService {
  constructor(@InjectQueue('payments')
  private readonly queueService: Queue) { }

  async addToQueue(paymentRequestDto: any) {

    const correlationId = paymentRequestDto.correlationId
    const amount = paymentRequestDto.amount
    const requestedAt = new Date().toISOString()

    const paymentProcessorRequestDto = {
      correlationId : correlationId,
      amount : amount,
      requestedAt: requestedAt,
    }

    await this.queueService.add('payments', paymentProcessorRequestDto)
  }
}
