import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsEntity } from './entities/statistics.entity';
import { BankEntity } from 'src/bank/enitites/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatisticsEntity, BankEntity])],
  providers: [StatisticsService],
  controllers: [StatisticsController],
  exports: [StatisticsService]
})
export class StatisticsModule {}
 