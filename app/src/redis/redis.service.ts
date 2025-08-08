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

  async set(paymentKeyValueStructure: any) {
    const key = paymentKeyValueStructure.key 
    const value = paymentKeyValueStructure.value
  try {
      await this.redis.set(key,value,'NX')
    }
    catch(error) {
      console.log('did not hit redis')
    }
  }
  async getSummary(fromDate: string, toDate: string) {
    
  }
}
