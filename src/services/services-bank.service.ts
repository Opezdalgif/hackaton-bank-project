import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceBankEntity } from './enities/service.entity';
import { Repository } from 'typeorm';
import { CreateServicesDto } from './dto/create-services.dto';
import { ServiceType } from 'src/common/constant/service.constant';

@Injectable()
export class ServicesBankService {
    constructor(
        @InjectRepository(ServiceBankEntity)
        private readonly serviceRepository: Repository<ServiceBankEntity>
    ){}

    async create(dto: CreateServicesDto) {
        const service = await this.serviceRepository.create(dto)

        try {
            await service.save()
        } catch(e) {
            throw new BadRequestException(`Ошибка в создании услуги`)
        }
    }

    async createAutomatick() {
        try {
            await this.serviceRepository.insert(ServiceType)
        } catch(e) {
            throw new BadRequestException(`Произошла ошибка в автодобавлении услуг`)
        }
    }

    async findOne(serviceId: number) {
        const service = await this.serviceRepository.findOne({
            where: {id: serviceId},
            relations: {
                Banks: true
            }
        })

        if(!service) {
            throw new BadRequestException(`Такой услуги нету или была удалена`)
        }

        return service
    }

    async findAll() {
        return this.serviceRepository.find({
            relations: {
                Banks: true
            }
        })
    }
}
