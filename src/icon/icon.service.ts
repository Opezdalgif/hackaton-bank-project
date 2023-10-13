import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IconEntity } from './enities/icon.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/common/types/JwtPayload.types';
import { CreateIconDto } from './dto/create-icon.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class IconService {

    private logger = new Logger(`ICON-SERVICE`)

    constructor(
        @InjectRepository(IconEntity)
        private readonly iconRepository: Repository<IconEntity>,
        private readonly fileService: FilesService
    ){}

    /**
     * Создание одной фотографии
     * @param jwtPayload 
     * @param icon 
     * @returns 
     */
    // async create(icon: any,IsUser: boolean,jwtPayload?: JwtPayload, bank_id?: number){
    //     const uploadedImage = this.fileService.uploadFileBase64(
    //         icon, 'photo'
    //     )
    //     let iconCreate;
    //     if(IsUser === true) {
    //         iconCreate = await this.iconRepository.create({
    //             icon: uploadedImage.publicPath,
    //             userId: jwtPayload.userId
    //         })
            
    //     } else {
    //         iconCreate = await this.iconRepository.create({
    //             icon: uploadedImage.publicPath,
    //             bankId: bank_id
    //         })
    //     }
        
    //     try{
    //         await iconCreate.save()
    //     } catch (e) {
    //         this.logger.error(e)
    //         throw new InternalServerErrorException('Ошибка при создании одной фоотграфии')
    //     }
        

    //     return iconCreate
    // }   

    /**
     * Поиск фотографии по userId
     * @param userId 
     * @returns 
     */
    async findOneByUserId(userId: number) {
        return this.iconRepository.find({
            // where: {userId: userId}
        })
    }
    
    /**
     * Удаление фотографии
     * @param iconId 
     */
    async remove(iconId: number) {
        const icon = await this.iconRepository.findOne({
            where: {id: iconId}
        })

        try {
            await icon.remove()
        } catch(e) {
            this.logger.error(e)
            throw new BadRequestException(`Произошла ошибка в удалении фотогогрфии`)
        }
    }
}
