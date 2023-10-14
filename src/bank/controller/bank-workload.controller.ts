import { Body, Controller, Delete, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import { BankWorkloadService } from "../service/bank-workload.service";
import { CreateBankWorkloadDto } from "../dto/create-bank-worload.dto";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { ValidationPipe } from "src/common/pipes/validation.pipe";

@Controller('bank-workload')
@UseGuards(AccessTokenGuard)
@UsePipes(ValidationPipe)
export class BankWorkloadController {
    constructor(
        private readonly bankWorkloadService: BankWorkloadService
    ){}

    @Post('create')
    create(
        @Body() dto: CreateBankWorkloadDto
    ) {
        return this.bankWorkloadService.create(dto)
    }

    @Delete('remove/:bankWorkloadId')
    remove(@Param('bankWorkloadId') bankWorkloadId: number) {
        return this.bankWorkloadService.remove(bankWorkloadId)
    }

}