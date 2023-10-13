import { Module } from '@nestjs/common';
import { IconService } from './icon.service';
import { IconController } from './icon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IconEntity } from './enities/icon.entity';
import { UsersEntity } from 'src/users/enities/users.enities';
import { FilesModule } from 'src/files/files.module';
import { BankEntity } from 'src/bank/enitites/bank.entity';

@Module({
  // imports: [TypeOrmModule.forFeature([IconEntity,UsersEntity,BankEntity]),
  //   FilesModule
  // ],
  providers: [IconService],
  controllers: [IconController],
  exports: [IconService]
})
export class IconModule {}
