import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ServicesBankService } from './services-bank.service';
import { CreateServicesDto } from './dto/create-services.dto';

@Controller('services-bank')
export class ServicesBankController {
    constructor(
        private readonly servicesBankService: ServicesBankService
    ) {}

    @Get('findAll')
    async findAll() {
        return this.servicesBankService.findAll()
    }

    @Get('findOne/:serviceId')
    async findOne(
        @Param('serviceId') serviceId: number
    ) {
        return this.servicesBankService.findOne(serviceId)
    }

    @Post('create')
    async create(@Body() dto: CreateServicesDto) {
        return this.servicesBankService.create(dto)
    }
}
