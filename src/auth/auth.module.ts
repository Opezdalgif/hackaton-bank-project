import { Global, Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenEntity } from './enities/refresh-token.entity';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { SessionEntity } from './enities/session.entity';

@Global()
@Module({
    imports:[JwtModule.register({}),forwardRef(() => UsersModule),TypeOrmModule.forFeature([RefreshTokenEntity, SessionEntity])],
    controllers:[AuthController],
    providers:[AuthService , AccessTokenStrategy , RefreshTokenStrategy , ConfigService],
    exports:[
        AuthService
    ]

})
export class AuthModule {}
