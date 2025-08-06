import { WorkerHost, Processor} from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { PaymentRequestDto } from 'src/payment-request/dto/create-payment-request.dto'
import { Injectable } from '@nestjs/common'
import { HttpService} from '@nestjs/axios'
import { DatabaseService } from 'src/database/database.service'
import { PaymentProcessorRequestDto } from 'src/payment-processor-request/dto/create-payment-processor-request.dto'
import { firstValueFrom } from 'rxjs'

@Processor('payments')
@Injectable()
export class PaymentsConsumer extends WorkerHost {
  constructor(
    private readonly httpService: HttpService,
    private readonly dbService: DatabaseService,
  ) {
    super()
  }

  async process(job: Job<PaymentRequestDto>): Promise<void> {
    const paymentRequestDto = job.data

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

    try {
      await firstValueFrom(
        this.httpService.post(
          'http://localhost:8001/payments',
          paymentProcessorRequestDto,
        ),
      )
      const payment_processor = 'default'
      const values = [correlationId, amount, requestedAt, payment_processor]
      await this.dbService.insert(values)
    } catch (error) {
      //if error, check health and wait, if healthy wait and try again, if not insert to fallback
      await firstValueFrom(
        this.httpService.post(
          'http://localhost:8002/payments',
          paymentProcessorRequestDto,
        ),
      )
      const payment_processor = 'fallback'
      const values = [correlationId, amount, requestedAt, payment_processor]
      await this.dbService.insert(values)
    }
  }
}

