import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, Patch, Delete, Query, ParseArrayPipe } from '@nestjs/common';
import { BankService } from '../service/bank.service';
import { CreateBankDto } from '../dto/create-bank.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { JwtPayloadParam } from 'src/common/decorators/jwt-payload.decorator';
import { AddServiceBankDto } from '../dto/add-service-bank.dto';
import { RemoveServiceBankDto } from '../dto/remove-service-bank.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AccountRoleEnum } from 'src/common/enums/account-role.enum';
import { BankFilerDto } from '../dto/bank-filter.dto';

@Controller('bank')
@UseGuards(AccessTokenGuard)
@UsePipes(ValidationPipe)
export class BankController {
    constructor(
        private readonly bankService: BankService
    ){}

    @Roles(AccountRoleEnum.Admin)
    @Post('create')
    create(
        @Body() dto: CreateBankDto
    ) {
        return this.bankService.create(dto)
    }

    @Get('findOne/:bankId')
    findOne(@Param('bankId') bank_id: number) {
        return this.bankService.findOne(bank_id)
    }

    @Get('findAll')
    findAll() {
        return this.bankService.findAll()
    }

    @Roles(AccountRoleEnum.Admin)
    @Patch('update/:bankId')
    update(
        @Body() dto: UpdateBankDto,
        @Param('bankId') bank_id: number
    ) {
        return this.bankService.update(dto, bank_id)
    }

    @Roles(AccountRoleEnum.Admin)
    @Delete('remove/:bankId')
    remove(@Param('bankId') bank_id: number) {
        return this.bankService.remove(bank_id)
    }

    @Post('/addServiceBank')
    addHobbies(
        @Body() dto: AddServiceBankDto,
    ) {
        return this.bankService.addServiceBank(dto.bankId, dto.serviceId)
    }

    @Post('/removeServiceBank')
    removeHobbies(
        @Body() dto: RemoveServiceBankDto
    ) {
        return this.bankService.removeServiceBank(dto.bankId, dto.serviceId)
    }

    @Get('filter')
    filter(@Query () dto: BankFilerDto) {
        const cleanedIdsString = dto.serviceIds.replace(/^\[|\]$/g, '');
        const ids: number[] = cleanedIdsString.split(',').map(id => parseInt(id));
        return this.bankService.findAllBankByFilter(ids, dto.workloadValue)
    }
}
