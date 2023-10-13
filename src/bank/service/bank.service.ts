import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from '../enitites/bank.entity';
import { Repository } from 'typeorm';
import { CreateBankDto } from '../dto/create-bank.dto';
import { IconService } from 'src/icon/icon.service';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { ServicesBankService } from 'src/services/services-bank.service';
import { FilesService } from 'src/files/files.service';
import { compareArrayValues } from 'src/common/function/compareArrayHighestValues.function';
import { WorkloadValue } from 'src/common/enums/worload.enum';

@Injectable()
export class BankService {

    private logger = new Logger(`BANK-SERVICE`)
    constructor(
        @InjectRepository(BankEntity)
        private readonly bankRepository: Repository<BankEntity>,
        private readonly filesService: FilesService,
        private readonly serviceBankService: ServicesBankService
    ){}

    async create(
        dto: CreateBankDto
    ) {

        const uploadedImage = await this.filesService.uploadFileBase64(
            dto.icon,
            'photo'
        )
        
        const bank = await this.bankRepository.create({
            ...dto,
            icon: uploadedImage.publicPath
        })
        

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
                Service: true,
                Workload:true
            }
        })

        if(!bank) {
            throw new BadRequestException(`Такого банка не существует или был удален`)
        }

        return bank
    }

    async findAll() {
        return this.bankRepository.find({
            relations: {
                Service: true,
                Workload: true
            }
        })
    }

    async update(dto: UpdateBankDto, bank_id: number) {
        const bank = await this.findOne(bank_id)

        const uploadedImage = await this.filesService.uploadFileBase64(
            dto.icon,
            'photo'
        )
        
        for(let key in dto) {
            bank[key] = dto[key]
        }
            
        bank.icon = uploadedImage.publicPath

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

    async findAllBankByFilter(serviceId: number,) {
        const banks = await this.bankRepository.find({
            where: {
                Service: {
                    id: serviceId
                }
            },
            relations: {
                Workload: true
            }
        })

        console.log(banks)
        const service = await this.serviceBankService.findOne(serviceId)
        let bankFilerService = []

        for(let bank of banks) {
            const arrayWorload = []

            let maxValue;
            let minValue;
            let avageValue;  
            
            bank.Workload.map(workload => arrayWorload.push(workload.nameService))
            const bankWordload = await compareArrayValues(arrayWorload)
            bankWordload.mostCommonValues.map(max => {
                if(max === service.name) {
                    maxValue = service.name
                }
            })
            bankWordload.leastCommonValues.map(min => {
                if(min === service.name) {
                    minValue = service.name
                }
            })
            bankWordload.averageValueArray.map(avage => {
                if(avage === service.name) {
                    avageValue = service.name
                }
            })

           let objectWorkload = {}
           
           if(maxValue) {
                objectWorkload = {
                    workload: WorkloadValue.HIGH,
                    bank: bank
                }
           }  else if (avageValue) {
            objectWorkload = {
                workload: WorkloadValue.AVARAGE,
                bank: bank
            }
           } else if (minValue) {
            objectWorkload = {
                workload: WorkloadValue.MIN,
                bank: bank
            }
           } 
           
           bankFilerService.push(objectWorkload)
        }

        return bankFilerService
    }

}
