import { Controller  , Post , Get , Body , Param, Patch, Delete, UsePipes, UseGuards, Req, Query} from '@nestjs/common';
import { JwtPayloadParam } from 'src/common/decorators/jwt-payload.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserChangePasswordDto } from '../dto/user-change-password.dto';
import { UserGetDto } from '../dto/user-get.dto';
import { UsersService } from '../services/users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtPayload } from 'src/common/types/JwtPayload.types';
import { AccountRoleEnum } from 'src/common/enums/account-role.enum';


@UseGuards(AccessTokenGuard)
@UsePipes(ValidationPipe)
@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ){}

    @Roles(AccountRoleEnum.Admin)
    @Post('/create')
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto)
    }

    @Get('/get')
    find(@Query() dto: UserGetDto){
        return  this.userService.getExists(dto)
    }

    @Get('/:userId/getOne')
    getOne(@Param('userId') userId: number){
        return this.userService.getExists({id: userId})
    }
    
    @Get('/getAll')
    findAll() { 
        return this.userService.findAll()
    }

    @Patch('/update')
    update(@JwtPayloadParam() jwtPayload: JwtPayload, @Body() dto: UpdateUserDto) {
        // return this.userService.update(jwtPayload, dto)
    }

    @Delete('/:userId/remove')
    delete(@Param('userId') userId: number) {
        return this.userService.remove(userId)
    }
    @Get('/getInfo')
    getInfo(@JwtPayloadParam() jwtPayload: JwtPayload) {
        return this.userService.getExists({ id: jwtPayload.userId });
    }

    @Roles(AccountRoleEnum.User)
    @Delete('/remove')
    deleteUser(@JwtPayloadParam() jwtPayload: JwtPayload) {
        return this.userService.remove(jwtPayload.userId)
    }

    @Patch('/update/password')
    changePassword(@JwtPayloadParam() jwtPayload: JwtPayload, @Body() dto: UserChangePasswordDto) {
        return this.userService.changePassword({id: jwtPayload.userId}, dto)
    }
}
