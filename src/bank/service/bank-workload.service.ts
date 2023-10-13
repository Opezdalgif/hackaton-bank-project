import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BankWorkloadEntity } from "../enitites/bank-workload.dto";
import { Repository } from "typeorm";
import { BankService } from "./bank.service";
import { CreateBankWorkloadDto } from "../dto/create-bank-worload.dto";

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
            throw new BadRequestException(`Ошибка добавление заявки занятости`)
        }
    }

    
}