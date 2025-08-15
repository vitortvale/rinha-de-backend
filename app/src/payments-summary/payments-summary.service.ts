import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service"

@Injectable()
export class PaymentsSummaryService {
  constructor(private redisService: RedisService) { }

  async getSummary(fromDate: String, toDate: String) {
    await this.redisService.getSummary(fromDate, toDate)
  }

}
