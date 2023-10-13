import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from './enitites/bank.entity';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';
import { IconService } from 'src/icon/icon.service';
import { UpdateBankDto } from './dto/update-bank.dto';
import { ServicesBankService } from 'src/services/services-bank.service';

@Injectable()
export class BankService {

    private logger = new Logger(`BANK-SERVICE`)
    constructor(
        @InjectRepository(BankEntity)
        private readonly bankRepository: Repository<BankEntity>,
        private readonly iconService: IconService,
        private readonly serviceBankService: ServicesBankService
    ){}

    async create(
        dto: CreateBankDto
    ) {
        const {icon, ...data} = dto
        const bank = await this.bankRepository.create({
            ...data
        })
        await this.iconService.create(icon,false,undefined,bank.id)

        try {
            await bank.save()
        } catch(e) {
            this.logger.error(e)
            throw new BadRequestException(`Произошла ошибка в создании банка`)
        }
    }

    async findOne(bank_id: number) {
        const bank = await this.bankRepository.findOne({
            where: {
                id: bank_id
            },
            relations: {
                Icon: true
            }
        })

        if(!bank) {
            throw new BadRequestException(`Такого банка не существует или был удален`)
        }

        return bank
    }

    async findAll() {
        return this.bankRepository.find()
    }

    async update(dto: UpdateBankDto, bank_id: number) {
        const bank = await this.findOne(bank_id)
        const {icon, ...data} = dto
        
        for(let key in data) {
            bank[key] = data[key]
        }
            
        const iconPath = await this.iconService.create(icon, false,undefined,bank_id)
        bank.Icon = iconPath

        try {
            await bank.save()
            return bank
        } catch(e) {
            this.logger.error(e)
            throw new InternalServerErrorException(`Ошибка в обновление банка`)
        }
    }

    async remove(bank_id: number) {
        const bank = await this.findOne(bank_id)
        try {
            await bank.remove()
        } catch(e) {
            throw new InternalServerErrorException(`Ошибка в удалении банка`)
        }
    }

    async addServiceBank(bankId: number, serviceId: number) {
        const bank = await this.findOne(bankId);
        const service = await this.serviceBankService.findOne(serviceId);
    
        if (!bank.Service) {
            bank.Service = [];
        }
    
        bank.Service.push(service);
    
        try {
            await this.bankRepository.save(bank);
        } catch (e) {
            this.logger.log(e);
            throw new BadRequestException(`Ошибка в добавлении хобби`);
        }
    }

    async removeServiceBank(bankId: number, serviceId: number) {
        const bank = await this.findOne(bankId)

        const service = await this.serviceBankService.findOne(serviceId)

        let copyArr = bank.Service.filter(ser => ser.id !== service.id)
       
        try {
            bank.Service = copyArr
            await bank.save()
        } catch(e) {
            this.logger.log(e)
            throw new BadRequestException(`Ошибка в удаление хобби`)
        }
    }

}
