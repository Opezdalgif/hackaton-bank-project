import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { IconService } from './icon.service';
import { CreateIconDto } from './dto/create-icon.dto';
import { JwtPayloadParam } from 'src/common/decorators/jwt-payload.decorator';
import { JwtPayload } from 'src/common/types/JwtPayload.types';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('icon')
export class IconController {
    constructor(
        private readonly iconService: IconService
    ){}

    @Post('/create')
    async create(
        @Body() dto: CreateIconDto,
        @JwtPayloadParam() jwtPayload: JwtPayload
    ) {
        return this.iconService.create(dto.icon, dto.IsUser,jwtPayload,dto.bank_id)
    }

    @Delete('/:id/delete')
    async remove(@Param('id') id: number) {
        return this.iconService.remove(id)
    }
}
