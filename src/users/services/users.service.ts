import { 
    Injectable, 
    Logger,
    InternalServerErrorException,
    BadRequestException

} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { UsersEntity } from '../enities/users.enities';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { AccountRoleEnum } from 'src/common/enums/account-role.enum';
import { JwtPayload } from 'src/common/types/JwtPayload.types';
import { UserGetDto } from '../dto/user-get.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserChangePasswordDto } from '../dto/user-change-password.dto';
import { compareArrayValues } from 'src/common/function/compareArrayHighestValues.function';
import { IconService } from 'src/icon/icon.service';
import { FilesService } from 'src/files/files.service';


@Injectable()
export class UsersService {
    
    private logger = new Logger('USER-SERVICE');

    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity> ,
        private readonly filesServices: FilesService,
    ){}

    /**
     * Создание пользователя
     * @param dto
     * @returns
     */
    async create(dto: CreateUserDto, roles: AccountRoleEnum = AccountRoleEnum.User) {
        const passwordHash = await bcrypt.hash(dto.passwordHash, 5)
        const user = await this.usersRepository.create({
            ...dto, 
            passwordHash: passwordHash,
            role: roles,
        })
        
        try {
            await user.save();
        } catch (err) {
            this.logger.error(`Произошла ошибка ${err}`)
            throw new InternalServerErrorException('Ошибка создания пользователя')
        }

        return user;
        
    }
    /**
     * Получение всех пользователей
     * 
     * @returns 
     */
    async findAll(){
        return this.usersRepository.find({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                role: true,
                icon: true
            },
          });
    }

    /**
     * Получения одного пользователя
     * @param whereDto 
     * @returns 
     */
    async find(whereDto: UserGetDto){
        return await this.usersRepository.findOne({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true,
                email: true,
                icon: true
            },
            where: whereDto,
        })
    }

    /**
     * Получения пароля пользователя
     * @param whereDto 
     * @returns 
     */
    async findPassword(whereDto: UserGetDto) {
        const user =  await this.usersRepository.findOneBy(whereDto)

        if(!user) {
            throw new InternalServerErrorException('Такого пользователя не существует')
        }
        
        return user;
    }
    /**
     * Получение и проверка на существование
     * @param whereDto
     * @returns
     */
    async getExists(whereDto: UserGetDto) {
        const user = await this.usersRepository.findOne({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                email: true,
                phoneNumber: true,
                icon: true
            }, 
            relations: {
                worklet: {
                    Bank: true,
                },
                reviews: true
            },
            where: whereDto,
        })

        if(!user) {
            throw new InternalServerErrorException('Пользователь не найден')
        }
        return user;
    }

    /**
     * Получения пользователя по id
     * @param id 
     * @returns 
     */
    async getOne(id: number){
        return await this.getExists({
            id: id
        })       
    }
   
    /**
     * Обноваление пользователя
     * @param id
     * @param dto
     * @returns
     */
    async update(jwtPayload: JwtPayload , dto: UpdateUserDto) { 

        try{
            const user = await this.getExists({id: jwtPayload.userId})

            const uploadedImage = await this.filesServices.uploadFileBase64(
                dto.icon,
                'photo',
            );

            for(let key in dto) {
                user[key] = dto[key]
            }
            
            user.icon = uploadedImage.publicPath
            await user.save()
            return user
        } catch(e) {
            this.logger.error(`Ошибка в обноваление пользователя: ${e}`)
            throw new InternalServerErrorException('Ошибка в обновление пользователя')
        }
    }

    /**
     * Удаления пользователя
     * @param userId 
     */
    async remove(userId: number) {
        const user = await this.getExists({id: userId})
    
        try {
            await user.remove()
        } catch (e) {
            this.logger.error(`Ошибка в удаление пользователя ${e}`)
            throw new InternalServerErrorException('Ошибка в удаление пользователя')
        }

    }

    /**
     * Смена пароля
     * @param where 
     * @param dto 
     */
    async changePassword(where: UserGetDto, dto: UserChangePasswordDto) {
        const user = await this.findPassword(where)

        if(!(await this.comparePassword(user, dto.oldPassword))) {
            throw new InternalServerErrorException('Пароль неверный')
        }

        const password = await bcrypt.hash(dto.password,5)

        try {
            user.passwordHash = password
            user.save()
        } catch (e) {
            this.logger.error(`Ошибка: ${e}`)
            throw new InternalServerErrorException('Произошла ошибка в обноваление пароля')
        }
    }

    /**
     * Проверка пароля
     * @param user 
     * @param password 
     * @returns 
     */
    async comparePassword(user: UsersEntity, password: string) {
        try {
            return await bcrypt.compare(password, user.passwordHash);
        } catch (e) {
            this.logger.error(
                `Ошибка проверки правильности пароля пароля: ${e}`,
            );
            throw new InternalServerErrorException(
                'Ошибка проверки правильности пароля',
            );
        }
    }
}
