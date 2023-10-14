import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
    constructor(
        private readonly statisticsService: StatisticsService
    ){}

    @Get('findOne/:statisticsId')
    findOne(@Param('statisticsId') statisticsId: number) {
        return this.statisticsService.findOne(statisticsId)
    }

    @Get('findAll')
    findAll() {
        return this.statisticsService.findAll()
    }
}
