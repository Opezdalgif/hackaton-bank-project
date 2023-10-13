import { Module, forwardRef } from '@nestjs/common';
import { ServicesBankController } from './services-bank.controller';
import { ServicesBankService } from './services-bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceBankEntity } from './enities/service.entity';
import { BankModule } from 'src/bank/bank.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceBankEntity]),
],
  controllers: [ServicesBankController],
  providers: [ServicesBankService],
  exports: [ServicesBankService]
})
export class ServicesBankModule {}
