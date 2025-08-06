import { BadRequestException } from '@nestjs/common';
import { z } from 'zod'

const paymentSchema = z.object({
    correlationId: z.uuid(),
    amount: z.number().positive(),
    requestedAt:  z.string().optional()
})

export class PaymentRequestDto {
    readonly correlationId: string
    readonly amount: number

    private constructor(data: z.output<typeof paymentSchema>) {
        this.correlationId = data.correlationId
        this.amount = data.amount
    }

    static create(input: z.input<typeof paymentSchema>) {
        const result = paymentSchema.safeParse(input)
        if(!result.success) {
           throw new BadRequestException(result.error) 
        }
        else {
            return new PaymentRequestDto(result.data)
        }
    }
}