import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BankWorkloadEntity } from "../enitites/bank-workload.dto";
import { Repository } from "typeorm";
import { BankService } from "./bank.service";
import { CreateBankWorkloadDto } from "../dto/create-bank-worload.dto";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class BankWorkloadService {
    constructor(
        @InjectRepository(BankWorkloadEntity)
        private readonly bankWorkloadRepository: Repository<BankWorkloadEntity>,
        private readonly bankService: BankService
    ){}

    async create(dto: CreateBankWorkloadDto) {
        const bank = await this.bankService.findOne(dto.bankId)

        let service;
        for (const bankService of bank.Service) {
            if(bankService.id === dto.serviceId) {
                service = bankService.name
            } else {
                null
            }
        }

        if(!service) {
            throw new BadRequestException(`Данную услугу банк не предоставляет`)
        }

        const workload = await this.bankWorkloadRepository.create({
            nameService: service,
            bankId: dto.bankId
        })
        console.log(workload)
        try {
            await workload.save()
        } catch(e){
            throw new BadRequestException(`Ошибка добавление заявки загружености`)
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_7PM)
    async deleteAll() {
        const workloads = await this.bankWorkloadRepository.find()

        for (let workload of workloads) {
           const workloadOne =  await this.bankWorkloadRepository.findOne({
                where: {
                    id: workload.id
                }
            })

            try {
                await workloadOne.remove()
            } catch(e) {
                throw new BadRequestException(`Произошла ошибка в удалении всех заявок загружености`)
            }  
            
        }
    }

    async remove(bankWorkloadId: number) {
        const workload = await this.bankWorkloadRepository.findOne({
            where: {
                id: bankWorkloadId
            }
        })

        try {
            await workload.remove()
        } catch(e) {
            throw new BadRequestException(`Произошла ошибка в удалении заявки загружености`)
        }
    }

    
}