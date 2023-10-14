import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BankWorkloadEntity } from "../enitites/bank-workload.entity";
import { Repository } from "typeorm";
import { BankService } from "./bank.service";
import { CreateBankWorkloadDto } from "../dto/create-bank-worload.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { JwtPayload } from "src/common/types/JwtPayload.types";
import { UsersService } from "src/users/services/users.service";
import { StatisticsService } from "src/statistics/statistics.service";

@Injectable()
export class BankWorkloadService {
    private logger = new Logger(`BANK-WORKLOAD-SERVICE`)
    constructor(
        @InjectRepository(BankWorkloadEntity)
        private readonly bankWorkloadRepository: Repository<BankWorkloadEntity>,
        private readonly bankService: BankService,
        private readonly usersService: UsersService,
        private readonly statisticsService: StatisticsService
    ){}

    async create(dto: CreateBankWorkloadDto, jwtPayload: JwtPayload) {

        const user = await this.usersService.getOne(jwtPayload.userId)

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
            bankId: dto.bankId,
            userId: jwtPayload.userId
        })

        try {
            await workload.save()
            await this.addStatistics(workload.id)
        } catch(e){
            this.logger.error(e)
            throw new BadRequestException(`Ошибка добавление заявки загружености`)
        }

        return workload
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

    async findOne(workloadId: number) {
        const workload = await this.bankWorkloadRepository.findOne({
            where: {
                id: workloadId
            },
            relations: {
                Bank: {
                    Statistics: true
                }
            }
        })

        if(!workload) {
            throw new BadRequestException(`Данной заявки загруженности нету`)
        }

        return workload
    }

    async addStatistics(workloadId: number) {
        const workload = await this.findOne(workloadId)

        if(workload.Bank.Statistics) {
            workload.Bank.Statistics.workloadCount += 1
            await workload.Bank.Statistics.save()
        } else {
            await this.statisticsService.create(workload.Bank.id)
        }
    }
}