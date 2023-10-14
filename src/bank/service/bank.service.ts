import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from '../enitites/bank.entity';
import { Repository, In } from 'typeorm';
import { CreateBankDto } from '../dto/create-bank.dto';
import { IconService } from 'src/icon/icon.service';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { ServicesBankService } from 'src/services/services-bank.service';
import { FilesService } from 'src/files/files.service';
import { compareArrayValues } from 'src/common/function/compareArrayHighestValues.function';
import { WorkloadValue } from 'src/common/enums/workload.enum';

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
                Workload:true,
                Statistics: true
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
                Workload: true,
                Statistics: true
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
            throw new BadRequestException(`Ошибка в добавлении услуги`);
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
            throw new BadRequestException(`Ошибка в удаление услуги`)
        }
    }

    async findAllBankByFilter(serviceIds: number[], workloadValues: WorkloadValue) {
        const banksFilter = [];

        const banks = await this.bankRepository.find({
            where: {
                Service: {
                    id: In(serviceIds)
                }
            },
            relations: {
                Workload: true,
                Service: true
            }
        });
        
        for (const bank of banks) {
            const arrayWorkload = bank.Workload.map(workload => workload.nameService);
            const bankWorkload = await compareArrayValues(arrayWorkload);

            const bankFilerService = bank.Service.map(service => {
                let workloadValue;

                if (bankWorkload.mostCommonValues.includes(service.name)) {
                    workloadValue = WorkloadValue.HIGH;
                } else if (bankWorkload.averageValueArray.includes(service.name)) {
                    workloadValue = WorkloadValue.AVARAGE;
                } else if (bankWorkload.leastCommonValues.includes(service.name)) {
                    workloadValue = WorkloadValue.MIN;
                }

                return {
                    serviceName: service.name,
                    workload: workloadValue
                };
            });

            banksFilter.push({
                workload: bankFilerService,
                bank: bank
            });
        }

        //const banksFilterWorkloadValue = []

        if(workloadValues) {
            const banksFilterWorkloadValue = banksFilter.filter(entry => {
                const hasMinWorkload = entry.workload.some(workload => workload.workload === workloadValues);
                return hasMinWorkload;
            });

            return banksFilterWorkloadValue
        }

        return banksFilter;
    }
}
