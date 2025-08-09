import Redis from 'ioredis'
import { Injectable } from '@nestjs/common'
import { OnModuleDestroy } from '@nestjs/common'

//TODO: query 
@Injectable()
export class RedisService {
  private readonly redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: 1
  })

  async set(paymentKeyValueStructure: any) {
    const key = paymentKeyValueStructure.paymentInfo.key
    const value = {
      "value": paymentKeyValueStructure.paymentInfo.value,
      "processor": paymentKeyValueStructure.processor
    }

    try {
      await this.redis.set(key, JSON.stringify(value), 'NX')
    }
    catch (error) {
      console.log('did not hit redis')
    }
  }
  async getSummary(fromDate: Date, toDate: Date) {
    let cursor = '0';
    let allKeys: Array<any> = [];

    do {
      // SCAN returns [cursor, keysArray]
      const [nextCursor, keys] = await this.redis.scan(cursor, 'COUNT', 100);
      cursor = nextCursor;
      allKeys = allKeys.concat(keys);
    } while (cursor !== '0');

    if (allKeys.length === 0) {
      console.log('No keys found');
      return;
    }

    // Fetch all values with MGET
    const values = await this.redis.mget(...allKeys);

    // Combine keys and values
    const result = allKeys.map((key, index) => ({ key, value: values[index] }));

    console.log(result);
  }

}
