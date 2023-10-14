import { Module } from '@nestjs/common';
import { AchivmentsController } from './achivments.controller';
import { AchivmentsService } from './achivments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchivmentsEntity } from './enities/achivments.entity';
import { UsersEntity } from 'src/users/enities/users.enities';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([AchivmentsEntity, UsersEntity]),
    FilesModule
  ],
  controllers: [AchivmentsController],
  providers: [AchivmentsService],
  exports: [AchivmentsService]
})
export class AchivmentsModule {}
