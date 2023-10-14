import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviewentity } from './entity/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/review-create.dto';
import { JwtPayload } from 'src/common/types/JwtPayload.types';

@Injectable()
export class ReviewService {

    private logger = new Logger('REVIEW')

    constructor(
        @InjectRepository(Reviewentity)
        private reviewRepository: Repository<Reviewentity>
    ){}

    async create(dto: CreateReviewDto, jwtPayload: JwtPayload){
        const review = await this.reviewRepository.create({
            ...dto,
            userId: jwtPayload.userId
        })

        try{
            await review.save()
        } catch (err) {
            this.logger.error(err)
            throw new InternalServerErrorException('Ошибка в создание отзыва')
        }

        return review
    }

    async getBankReview(bankId: number){
        const bankReviews = await this.reviewRepository.find({
            select: {
                userId: true,
                bankId: true,
                text: true,
                mark: true,
            },
            relations: {
                bank: true,
                user: true
            },
            where: {bankId: Number(bankId)}
        })

        return bankReviews
    }

}
