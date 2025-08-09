import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service"

@Injectable()
export class PaymentsSummaryService {
  constructor(private redisService: RedisService) { }

  async getSummary(fromDate: Date, toDate: Date) {
    await this.redisService.getSummary(fromDate, toDate)
  }

}
