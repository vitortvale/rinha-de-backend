import { BadRequestException } from '@nestjs/common'
import { z }  from 'zod'

const summarySchema = z.object({
    totalRequests: z.number(),
    totalAmount: z.number()

}) 
const paymentsSummarySchema = z.object({
    default: summarySchema,
    fallback: summarySchema
})

export class PaymentSummaryDto {
    private readonly default: z.output<typeof summarySchema>
    private readonly fallback: z.output<typeof summarySchema>

    private constructor(data: z.output<typeof paymentsSummarySchema>) {
        this.default = data.default
        this.fallback = data.fallback
    }

    static create(input: z.input<typeof paymentsSummarySchema>) {
        const result = paymentsSummarySchema.safeParse(input)
        if(!result.success) {
            throw new BadRequestException(result.error)
        }
        else {
            return new PaymentSummaryDto(result.data)
        }
    }
}