import { MediatorService } from '@core/common/services';
import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly mediatorService: MediatorService){}
}
