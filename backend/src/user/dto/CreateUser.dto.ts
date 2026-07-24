import { IsEmail, IsNotEmpty, MinLength } from "class-validator";


export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(2)
    name!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @MinLength(10)
    password!: string;
}
