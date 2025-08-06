import { BadRequestException } from '@nestjs/common'
import { z } from 'zod'

const paymentProcessorRequestSchema = z.object({
    correlationId: z.uuid(),
    amount: z.number().positive(),
    requestedAt: z.string()
})

export class PaymentProcessorRequestDto {
    readonly correlationId: string
    readonly amount: number
    readonly requestedAt: string 

    private constructor(data: z.output<typeof paymentProcessorRequestSchema>) {
       this.correlationId = data.correlationId
       this.amount = data.amount
       this.requestedAt = data.requestedAt
    }
    
    static create(input: z.input<typeof paymentProcessorRequestSchema>) {
        const result = paymentProcessorRequestSchema.safeParse(input)
        if(!result.success) {
            throw new BadRequestException
        }
        else {
            return new PaymentProcessorRequestDto(result.data)
        }
    }
}