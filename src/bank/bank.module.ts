import { Module, forwardRef } from '@nestjs/common';
import { BankController } from './controller/bank.controller';
import { BankService } from './service/bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from './enitites/bank.entity';
import { IconEntity } from 'src/icon/enities/icon.entity';
import { IconModule } from 'src/icon/icon.module';
import { ServicesBankModule } from 'src/services/services-bank.module';
import { FilesModule } from 'src/files/files.module';
import { BankWorkloadEntity } from './enitites/bank-workload.dto';
import { BankWorkloadController } from './controller/bank-workload.controller';
import { BankWorkloadService } from './service/bank-workload.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity, IconEntity, BankWorkloadEntity]),
  ServicesBankModule,
  FilesModule
],
  controllers: [BankController, BankWorkloadController],
  providers: [BankService, BankWorkloadService]
})
export class BankModule {}
