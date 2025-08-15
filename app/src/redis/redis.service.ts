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
    const score = dto.requestedAt
    try {
      await this.redis.zadd("payments", "NX", score, JSON.stringify(dto))
    }
    catch (error) {
      console.log(error)
    }
  }

  async getSummary(fromDate: string, toDate: string) {
    const fromDateIso = Date.parse(fromDate)
    const toDateIso = Date.parse(toDate)

    const results = await this.redis.zrangebyscore("payments", fromDateIso, toDateIso)
    //console.log(results)
}

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
