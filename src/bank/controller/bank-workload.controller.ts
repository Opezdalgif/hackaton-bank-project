import { Body, Controller, Delete, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import { BankWorkloadService } from "../service/bank-workload.service";
import { CreateBankWorkloadDto } from "../dto/create-bank-worload.dto";
import { AccessTokenGuard } from "src/common/guards/accessToken.guard";
import { ValidationPipe } from "src/common/pipes/validation.pipe";
import { JwtPayloadParam } from "src/common/decorators/jwt-payload.decorator";
import { JwtPayload } from "src/common/types/JwtPayload.types";

@Controller('bank-workload')
@UseGuards(AccessTokenGuard)
@UsePipes(ValidationPipe)
export class BankWorkloadController {
    constructor(
        private readonly bankWorkloadService: BankWorkloadService
    ){}

    @Post('create')
    create(
        @Body() dto: CreateBankWorkloadDto,
        @JwtPayloadParam() JwtPayload: JwtPayload
    ) {
        return this.bankWorkloadService.create(dto, JwtPayload)
    }

    @Delete('remove/:bankWorkloadId')
    remove(@Param('bankWorkloadId') bankWorkloadId: number) {
        return this.bankWorkloadService.remove(bankWorkloadId)
    }

}