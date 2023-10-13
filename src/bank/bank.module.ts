import { Module, forwardRef } from '@nestjs/common';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from './enitites/bank.entity';
import { IconEntity } from 'src/icon/enities/icon.entity';
import { IconModule } from 'src/icon/icon.module';
import { ServicesBankModule } from 'src/services/services-bank.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity, IconEntity]),
  IconModule,
  ServicesBankModule
],
  controllers: [BankController],
  providers: [BankService]
})
export class BankModule {}
