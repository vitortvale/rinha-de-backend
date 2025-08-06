import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { from } from 'rxjs';
import { PaymentSummaryDto } from 'src/payments-summary/dto/payment-summary.dto';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool = new Pool({
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
    
  });

  async insert(params: any[]): Promise<any> {
    const sql = `
        INSERT INTO payments (correlationId, amount, requested_at, processor)
        VALUES ($1, $2, $3, $4)
    `
    try {
        const result = await this.pool.query(sql, params);
        console.log('Writing to db')
    }
    catch(error) {
        throw error
    }
  }

  async getSummary(params: any[]): Promise<PaymentSummaryDto> {
    const sql =`
        SELECT COUNT(*) AS totalRequests, COALESCE(SUM(amount), 0) AS totalAmount FROM payments
        WHERE requested_at BETWEEN $1 AND $2
        AND processor = $3 
    `
    try {
        const fromDate = params[0]
        const toDate = params[1]

        const rawDefaultSummary =  await this.pool.query(sql, [fromDate, toDate, "default"])
        const rawFallbackSummary = await this.pool.query(sql, [fromDate, toDate, "fallback"])

        const defaultTotalRequests = Number(rawDefaultSummary.rows[0].totalrequests) 
        const defaultTotalAmount = Number(rawDefaultSummary.rows[0].totalamount)

        const defaultSummary = {
          "totalRequests": defaultTotalRequests,
          "totalAmount": defaultTotalAmount
        }

        const fallbackTotalRequests = Number(rawFallbackSummary.rows[0].totalrequests)
        const fallbackTotalAmount = Number(rawFallbackSummary.rows[0].totalamount)

        const fallbackSummary = {
          "totalRequests": fallbackTotalRequests,
          "totalAmount": fallbackTotalAmount
        }

        const rawPaymentSummaryDto = {
          "default": defaultSummary,
          "fallback": fallbackSummary
        }

        console.log(defaultSummary)
        console.log(fallbackSummary)

        return PaymentSummaryDto.create(rawPaymentSummaryDto)

    }
    catch(error) {
        throw error
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
