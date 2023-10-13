import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersEntity } from './enities/users.enities';
import { UsersService } from './services/users.service';
import { SessionEntity } from 'src/auth/enities/session.entity';
import { UsersController } from './controller/users.controller';
import { IconModule } from 'src/icon/icon.module';


@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      SessionEntity,
    ]),
    IconModule
],
  controllers:[UsersController],
  providers: [UsersService], 
  exports:[
    UsersService,

  ]
})
export class UsersModule {}
