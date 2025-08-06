import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'

@Injectable()
export class QueueService{
    constructor(@InjectQueue('payments') private paymentQueue: Queue) {}
}