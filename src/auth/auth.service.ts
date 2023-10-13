import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/services/users.service';
import * as bcrypt from 'bcryptjs';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './enities/refresh-token.entity';
import { Repository } from 'typeorm';
import { UsersEntity } from '../users/enities/users.enities';
import { JwtPayload } from 'src/common/types/JwtPayload.types';
import { SessionEntity } from './enities/session.entity';
import { SessionUnavailableException } from 'src/common/exceptions/session-unavailable.exception';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';

@Injectable()
export class AuthService {

   private readonly logger = new Logger('AUTH-SERVICE');

    constructor(

      @InjectRepository(RefreshTokenEntity)
      private refreshTokenRepository: Repository<RefreshTokenEntity>,

      @InjectRepository(SessionEntity)
      private authSessionRepository: Repository<SessionEntity>,

      private usersService: UsersService,
      private jwtService: JwtService,
      private configService: ConfigService,
    ){}

    /**
     * Регистрация
     * @param dto 
     * @returns 
     */
    async signUp(dto: AuthSignUpDto) {
      
        if (
            (await this.usersService.find({
                phoneNumber: dto.phoneNumber,
            }))
        ) {
            throw new InternalServerErrorException(
                'Аккаунт с указанным номером телефона уже зарегистрирован',
            );
        }

        let user = await this.usersService.create({
            email: dto.email,
            passwordHash: dto.password,
            phoneNumber: dto.phoneNumber,
        });
        

        return this.getTokens(user)
    }

    /**
     * Авторизация
     * @param dto 
     * @returns 
     */
    async signIn(dto: AuthSignInDto) {
        
        let user: UsersEntity
        if (!(user = await this.usersService.findPassword(
           dto.phoneNumber ? {phoneNumber: dto.phoneNumber} : {email: dto.email}
        ))) {
           throw new BadRequestException('Аккаунт с указанной почтой или номером телефона не существует')
        }

        if(!(await this.usersService.comparePassword(user, dto.password))) {
            throw new BadRequestException('Пароль неверный')
        }

        const tokens = await this.getTokens(user)
        return tokens;
    }

    /**
     * Выход из сессии
     * @param jwtPaylod 
     * @returns 
     */
    async logout(jwtPaylod: JwtPayload) {
        const session = await this.get(
          jwtPaylod.sessionId,
      );
      await this.deactivate(session);

      return;
    }

    /**
     * Создание access и refresh токенов
     * @param user 
     * @returns 
     */ 
     async getTokens(user: UsersEntity) {
      const session = await this.register(user.id);

      const jwtPayload: JwtPayload = {
          sessionId: session.id,
      };
       
      const accessToken = await this.jwtService.signAsync(jwtPayload, {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn:
              this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES'),
      });

      const refreshToken = await this.jwtService.signAsync(jwtPayload, {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
              'JWT_REFRESH_EXPIRES',
          ),
      });

      return { accessToken, refreshToken };
    }

    /**
     * Перезапись refresh токена
     * @param jwtPayload 
     * @returns 
     */
    async refreshTokens(jwtPayload: JwtPayload) {
      const session = await this.get(jwtPayload.sessionId);
      const accountId = session.userId;
      await this.deactivate(session);

      const account = await this.usersService.find({
          id: accountId,
      });
      return await this.getTokens(account);
  }

    /**
     * Регистрация сессии
     * @param accountId
     * @returns
     */
    async register(accountId: number) {
      let session: SessionEntity;
      try {
          session = await this.authSessionRepository.create({userId: accountId });
          await session.save();
      } catch (e) {
          this.logger.error(e);
          throw new InternalServerErrorException(`Произошла ошибка в регистрации сессии`);
      }

      return session;
  }

  /**
   * Декодировать JWT
   * @param token
   * @returns
   */
  async decodeJWT(token: string): Promise<JwtPayload> {
      return this.jwtService.decode(token) as JwtPayload;
  }

  /**
   * Проверка на существование и получение сессии
   * @param sessionId
   * @returns
   */
  async get(sessionId: number) {
      const session = await this.authSessionRepository.findOne({
          where: { id: sessionId },
          relations: {
            user: {}
          }
      });
      if (!session || session.isClosed) {
          throw new SessionUnavailableException();
      }

      return session;
  }

  /**
   * Деактивировать сессию
   * @param session
   * @returns
   */
  async deactivate(session: SessionEntity | number) {
      if (typeof session === 'number') {
          session = await this.get(session);
      }
      session.isClosed = true;
      try {
          await session.save();
      } catch (e) {
         // this.logger.error(e);
          throw new InternalServerErrorException();
      }

      return;
  }

}    
    
    

