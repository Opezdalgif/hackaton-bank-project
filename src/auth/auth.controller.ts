import { Body, Controller, Get, Post, UseGuards,UsePipes } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { JwtPayload } from 'src/common/types/JwtPayload.types';
import { JwtPayloadParam } from 'src/common/decorators/jwt-payload.decorator';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';

@UsePipes(ValidationPipe)
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}
  
    @Post('/signIn')
    signIn(@Body() dto: AuthSignInDto) {
        return this.authService.signIn(dto)
    }

    @Post('signUp')
    signUp(@Body() dto: AuthSignUpDto){
        return this.authService.signUp(dto)
    }


    @UseGuards(AccessTokenGuard)
    @Get('/logout')
    logout(@JwtPayloadParam() jwtPayload: JwtPayload) {
        this.authService.logout(jwtPayload)
    }

    @Get('/refresh')
    @UseGuards(RefreshTokenGuard)
    refreshTokens(@JwtPayloadParam() jwtPayload: JwtPayload) {
        return this.authService.refreshTokens(jwtPayload);
    }
}
