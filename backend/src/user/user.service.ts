import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService

    ){}

    async createUser(createUserDto: CreateUserDto){
        let emailAttempt;
        try{
            emailAttempt = await this.prismaService.user.findFirst({
                where:{
                    email: createUserDto.email
                }
            })
        }catch(err){
            throw new InternalServerErrorException(err)
        }

        console.log(emailAttempt);
        return emailAttempt

        try{
            await this.prismaService.user.create({
            data:{
                name: createUserDto.name,
                email: createUserDto.email,
                passwordHash: createUserDto.password
            }
        })
        }catch(err){
            throw new InternalServerErrorException(err)
        }

    }
}
