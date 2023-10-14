import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users/enities/users.enities';
import { SessionEntity } from './auth/enities/session.entity';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BankModule } from './bank/bank.module';
import { ServicesBankModule } from './services/services-bank.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AchivmentsModule } from './achivments/achivments.module';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      entities: [
        UsersEntity,
        SessionEntity
      ],
      synchronize: true,
       
      
    }),
    FilesModule,
    UsersModule,
    AuthModule,
    BankModule,
    ServicesBankModule,
    StatisticsModule,
    AchivmentsModule
  ],
})
export class AppModule {}
