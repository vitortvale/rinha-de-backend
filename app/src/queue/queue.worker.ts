import { WorkerHost, Processor, InjectQueue } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { DatabaseService } from 'src/database/database.service'
import { PaymentProcessorRequestDto } from 'src/payment-processor-request/dto/create-payment-processor-request.dto'
import { firstValueFrom } from 'rxjs'
import { Queue } from 'bullmq'

@Processor('payments')
@Injectable()
export class PaymentsConsumer extends WorkerHost {
  constructor(
    private readonly httpService: HttpService,
    private readonly dbService: DatabaseService,
    @InjectQueue('payments')private readonly queueService : Queue
  ) {
    super()
  }

  async process(job: Job<PaymentProcessorRequestDto>): Promise<void> {

    const paymentProcessorRequestDto = job.data

    const correlationId = paymentProcessorRequestDto.correlationId
    const amount = paymentProcessorRequestDto.amount
    const requestedAt = paymentProcessorRequestDto.requestedAt
    try {
      try {
        await firstValueFrom(
          this.httpService.post(
            'http://payment-processor-default:8080/payments',
            paymentProcessorRequestDto,
          ),
        )
        const payment_processor = 'default'
        const values = [correlationId, amount, requestedAt, payment_processor]
        await this.dbService.insert(values)

      } catch (error) {
        await firstValueFrom(
          this.httpService.post(
            'http://payment-processor-fallback:8080/payments',
            paymentProcessorRequestDto
          ),
        )
        const payment_processor = 'fallback'
        const values = [correlationId, amount, requestedAt, payment_processor]
        await this.dbService.insert(values)
      }
    }
    catch (error) {
      await this.queueService.add('payments', job.data, {
        delay: 5000,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }) 

    }
  }


}

