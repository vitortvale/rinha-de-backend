import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { PaymentsConsumer } from "./queue.worker";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || '6379'),
            }
        }),
        BullModule.registerQueue({
            name: 'payments',
        }),
        HttpModule,
        DatabaseModule
    ],
    providers: [
        QueueService,
        PaymentsConsumer,
    ],
    exports: [
        QueueService,
        PaymentsConsumer,
        HttpModule
    ]
})
export class QueueModule { }
