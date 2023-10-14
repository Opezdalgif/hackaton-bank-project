import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviewentity } from './entity/review.entity';
import { ReviewController } from './review.controller';

@Module({
  controllers: [ReviewController],
  imports: [TypeOrmModule.forFeature([Reviewentity])],
  providers: [ReviewService]
})
export class ReviewModule {}
