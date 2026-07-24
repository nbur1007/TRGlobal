import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { PrismaService } from '../prisma.service';
import { encodePassword } from '../utils/bcrypt';

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
            throw new InternalServerErrorException(err);
        }

        console.log(emailAttempt);
        if(emailAttempt != null){
            throw new BadRequestException('Email is already registered.');
        }

        let password = encodePassword(createUserDto.passwordHash);

        try{
            await this.prismaService.user.create({
            data:{
                name: createUserDto.name,
                email: createUserDto.email,
                passwordHash: password,
            }
        });
        }catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    async findUser(email: string){
        const user = await this.prismaService.user.findFirst({
            where: {
                email: email,
            },
        });

        return user;
    }
}
