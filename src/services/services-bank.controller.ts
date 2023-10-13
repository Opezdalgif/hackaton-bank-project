import { Controller } from '@nestjs/common';
import { ServicesBankService } from './services-bank.service';

@Controller('services')
export class ServicesBankController {
    constructor(
        private readonly servicesBankService: ServicesBankService
    ) {}

    async findAll() {
        return this.servicesBankService.findAll()
    }
}
