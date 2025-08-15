import Redis from 'ioredis'
import { Injectable } from '@nestjs/common'
import { OnModuleDestroy } from '@nestjs/common'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: 1
  })

  async zadd(dto: any) {
    const score = Number(dto.requestedAt)
    try {
      await this.redis.zadd('payments', score, JSON.stringify(dto), 'NX')
    }
    catch (error) {
      console.log('did not hit redis')
    }
  }
  async getSummary(fromDate: String, toDate: String) {
    await this.redis.zrangebyscore('payment', Number(fromDate), Number(toDate))
  }


  async onModuleDestroy() {
    await this.redis.quit();
  }
}
