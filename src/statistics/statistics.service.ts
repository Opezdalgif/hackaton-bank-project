import { BadGatewayException, BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatisticsEntity } from './entities/statistics.entity';

@Injectable()
export class StatisticsService {
    private logger = new Logger(`STATISTICS-SERVICE`)
    constructor(
        @InjectRepository(StatisticsEntity)
        private readonly statisticsRepository: Repository<StatisticsEntity>
    ) {}

    async create(bankId: number) {
        const statistics = await this.statisticsRepository.create({
            workloadCount: 1,
            bankId: bankId
        })

        try {
            await statistics.save()
        } catch(e) {
            this.logger.error(e)
            throw new BadRequestException(`Произошла ошибка в создании статистики`)
        }

    }

    findAll() {
        return this.statisticsRepository.find()
    }

    async findOne(statisticsId: number) {
        const statistics = await this.statisticsRepository.findOne({
            where: {
                id: statisticsId
            }
        })

        if(!statistics) {
            throw new BadRequestException(`Такой статистики нету`)
        }

        return statistics
    }


}
