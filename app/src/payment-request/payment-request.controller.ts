import { Body, Controller, createParamDecorator, Post, Res, HttpStatus} from "@nestjs/common";
import { PaymentRequestDto} from "./dto/create-payment-request.dto";
import { PaymentsRequestService } from "./payment-request.service";

@Controller('payments')
export class PaymentsController {
    constructor(private paymentsRequestService: PaymentsRequestService) {}

    @Post()
    async create(@Body() paymentDto: PaymentRequestDto): Promise<void> {
        return await this.paymentsRequestService.addtoqueue(paymentDto)
    } 
   
}
