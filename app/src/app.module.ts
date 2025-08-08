import { Module } from '@nestjs/common';
import { PaymentsController } from './payment-request/payment-request.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PaymentsRequestService } from './payment-request/payment-request.service';
//import { PaymentsSummaryService } from './payments-summary/payments-summary.service';
//import { PaymentsSummaryController } from './payments-summary/payments-summary.controller';
import { QueueModule } from './queue/queue.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue/queue.service';
import { PaymentsConsumer } from './queue/queue.worker'
import {RedisModule} from './redis/redis.module'

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      }
    }),
    BullModule.registerQueue({
      name: 'payments',
    }),
    HttpModule.register({ timeout: 5000 }),
    QueueModule,
    RedisModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsRequestService,  QueueService, PaymentsConsumer ],
})
export class AppModule {}
