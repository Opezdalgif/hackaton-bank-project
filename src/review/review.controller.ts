import { Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review-create.dto';
import { JwtPayloadParam } from 'src/common/decorators/jwt-payload.decorator';
import { JwtPayload } from 'src/common/types/JwtPayload.types';

@UseGuards(AccessTokenGuard)
@UsePipes(ValidationPipe)
@Controller('review')
export class ReviewController {

    constructor(
        private readonly reviewService: ReviewService
    ){}


    @Post('/create')
    create(
        @Body() dto: CreateReviewDto,
        @JwtPayloadParam() jwtPayload: JwtPayload
    ){
        return this.reviewService.create(dto, jwtPayload)
    }

    @Get('/getBankReviews/:bankId')
    getbankReviews(
        @Param('bankId') bankId: number
    ){
        return this.reviewService.getBankReview(bankId)
    }
}
