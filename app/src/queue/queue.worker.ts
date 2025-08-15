import { WorkerHost, Processor, InjectQueue } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { Queue } from 'bullmq'
import { RedisService } from '../redis/redis.service'


@Processor('payments')
@Injectable()
export class PaymentsConsumer extends WorkerHost {
  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    @InjectQueue('payments') private readonly queueService: Queue
  ) {
    super()
  }

  async process(job: Job<any>): Promise<void> {
    const paymentRequestDto = job.data

    const correlationId = paymentRequestDto.correlationId
    const amount = paymentRequestDto.amount
    const requestedAt = paymentRequestDto.requestedAt

    const paymentProcessorRequestDto = {
      "correlationId": correlationId,
      "amount": amount,
      "requestedAt" : requestedAt
    }
  //Pra escrever no banco precisa ser timestamp normal, para a transoformacao em int iso deve ser feita internamente
    try {
      try {
        console.log(paymentProcessorRequestDto)
        await firstValueFrom(
          this.httpService.post(
            'http://payment-processor-default:8080/payments',
            paymentProcessorRequestDto
          )
        )
        await this.redisService.zadd({
          correlationId: correlationId,
          amount: amount,
          requestedAt: requestedAt,
          processor: "default"
        })


      } catch (error) {
        console.log(paymentProcessorRequestDto)
        await firstValueFrom(
          this.httpService.post(
            'http://payment-processor-fallback:8080/payments',
            paymentProcessorRequestDto
          )
        )
        await this.redisService.zadd({
          correlationId: correlationId,
          amount: amount,
          requestedAt: requestedAt,
          processor: "fallback"
        })
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

