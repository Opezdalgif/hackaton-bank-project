import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AchivmentsService } from './achivments.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AccountRoleEnum } from 'src/common/enums/account-role.enum';
import { CreateAchivmentsDto } from './dto/create-achivments.dto';
import { UpdateAchievementDto } from './dto/update-achivments.dto';

@Controller('achivments')
export class AchivmentsController {
    constructor(
        private readonly achievementService: AchivmentsService
    ){}

    @Roles(AccountRoleEnum.Admin)
    @Post('create')
    create(
        @Body() dto: CreateAchivmentsDto
    ) {
        return this.achievementService.create(dto)
    }

    @Get('findOne/:achivmentId')
    findOne(@Param('achivmentId') achivmentId: number) {
        return this.achievementService.findOne(achivmentId)
    }

    @Get('findAll')
    findAll() {
        return this.achievementService.findAll()
    }

    @Roles(AccountRoleEnum.Admin)
    @Patch('update/:achivmentId')
    update(
        @Body() dto: UpdateAchievementDto,
        @Param('achivmentId') achivmentId: number
    ) {
        return this.achievementService.update(achivmentId,dto)
    }

    @Roles(AccountRoleEnum.Admin)
    @Delete('remove/:achivmentId')
    remove(@Param('achivmentId') achivmentId: number) {
        return this.achievementService.remove(achivmentId)
    }
}
