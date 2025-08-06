import { DatabaseService } from "src/database/database.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PaymentsSummaryService {
    constructor(private dbService: DatabaseService) {}

    async getSummary(fromDate: Date, toDate: Date) {
        const values =  [fromDate, toDate]
        return await this.dbService.getSummary(values)
    }
}