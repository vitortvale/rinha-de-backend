import Redis from 'ioredis'
import { Injectable } from '@nestjs/common'
import { OnModuleDestroy } from '@nestjs/common'

//TODO: implement the insertion and query 
@Injectable()
export class RedisService {
  private readonly redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  })

  async set(procesedPayment: any) {
    //await this.redis.set(a,b,'NX')
  }

}
