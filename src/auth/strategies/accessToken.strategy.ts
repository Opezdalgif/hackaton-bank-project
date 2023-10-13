import {Injectable} from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/common/types/JwtPayload.types";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {

    constructor(){
        super({
             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()  ,
             secretOrKey: process.env.JWT_ACCESS_SECRET ,
        })
    }
    
    validate(payload: JwtPayload){
        return payload;
    }
}