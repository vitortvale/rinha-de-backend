import { WorkerHost, Processor, InjectQueue } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { Queue } from 'bullmq'
import { RedisService } from 'src/redis/redis.service'


@Processor('payments')
@Injectable()
export class PaymentsConsumer extends WorkerHost {
  constructor(
    private readonly redisSerivce: RedisService,
    private readonly httpService: HttpService,
    @InjectQueue('payments') private readonly queueService: Queue
  ) {
    super()
  }

  async process(job: Job<any>): Promise<void> {
    //TODO: insert the key-value in redis properly
    const paymentRequestDto = job.data

    const correlationId = paymentRequestDto.correlationId
    const amount = paymentRequestDto.amount
    const requestedAt = paymentRequestDto.requestedAt

    const paymentProcessorRequestDto = {
      correlationId: correlationId,
      amout: amount,
      requestedAt: requestedAt
    }
    const value = {
      amount: amount,
      requestedAt: requestedAt
    }
    const paymentKeyValueStructure = {
      key: correlationId,
      value: value
    }

    try {
      try {
        await firstValueFrom(
          this.httpService.post(
            'http://payment-processor-default:8080/payments',
            paymentProcessorRequestDto,
          ),
        )
        const payment_processor = 1

      } catch (error) {
        await firstValueFrom(
          this.httpService.post(
            'http://payment-processor-fallback:8080/payments',
            paymentProcessorRequestDto
          ),
        )
        const payment_processor = 2
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

