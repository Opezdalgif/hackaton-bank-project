import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchivmentsEntity } from './enities/achivments.entity';
import { Repository } from 'typeorm';
import { AchivmentsType } from 'src/common/constant/achivments.contant';
import { FilesService } from 'src/files/files.service';
import { CreateAchivmentsDto } from './dto/create-achivments.dto';
import { UpdateAchievementDto } from './dto/update-achivments.dto';

@Injectable()
export class AchivmentsService {
    private logger = new Logger(`ACHIVMENTS-SERVICE`)
    constructor(
        @InjectRepository(AchivmentsEntity)
        private readonly achivmentsRepository: Repository<AchivmentsEntity>,
        private readonly filesService: FilesService
    ){}

    async createAuto() {
         for( let i = 0; i < AchivmentsType.length;i++) {
            const uploadedImage = await this.filesService.uploadFileBase64(
                AchivmentsType[i].icon,
                'photo'
            )

            const achivment = await this.achivmentsRepository.create({
                name: AchivmentsType[i].name,
                get: AchivmentsType[i].get,
                icon: uploadedImage.publicPath
            })

            await achivment.save()
         }
    }

    async create(dto: CreateAchivmentsDto) {
        const uploadedImage = await this.filesService.uploadFileBase64(
            dto.icon,
            'photo'
        )

        const achivment = await this.achivmentsRepository.create({
            name: dto.name,
            get: dto.get,
            icon: uploadedImage.publicPath
        })

        try {
            await achivment.save()
        } catch(e) {
            this.logger.error(e)
            throw new InternalServerErrorException(`Ошибка создания достижения`)
        }
    }

    async findOne(achivmentId: number) {
        const achivment = await this.achivmentsRepository.findOne({
            where: {
                id: achivmentId
            }
        })

        if(!achivment) {
            throw new BadRequestException(`Данного достижение нету`)
        }
        
        return achivment
    }

    async findAll(){
        return this.achivmentsRepository.find()
    }

    async update(achivmentId: number, dto: UpdateAchievementDto) {
        const achivment = await this.findOne(achivmentId)

        const uploadedImage = await this.filesService.uploadFileBase64(
            dto.icon,
            'photo'
        )
        
        for(let key in dto) {
            achivment[key] = dto[key]
        }
            
        achivment.icon = uploadedImage.publicPath

        try {
            await achivment.save()
            return achivment
        } catch(e) {
            this.logger.error(e)
            throw new InternalServerErrorException(`Ошибка в обновление достижения`)
        }
    }

    async remove(achivmentId: number) {
        const achivment = await this.findOne(achivmentId)

        try {
            await achivment.save()
        } catch(e) {
            this.logger.error(e)
            throw new InternalServerErrorException(`Ошибка удаления достижения`)
        }
    } 
}
