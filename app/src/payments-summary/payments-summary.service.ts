import { Injectable } from "@nestjs/common";
import {RedisService} from "../redis/redis.service.ts"

@Injectable()
export class PaymentsSummaryService {
    constructor(private redisService: RedisService) {}

    async getSummary(fromDate: Date, toDate: Date) {
      
    }
  
}
