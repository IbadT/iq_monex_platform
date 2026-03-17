import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class CreateWorkerDto {
    @ApiProperty({
        description: 'Worker name',
        example: 'Иванов Иван Иванович',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Worker email',
        example: 'ivanov@example.com',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        description: 'Worker phone',
        example: '+79991234567',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    phone: string;
    
    @ApiProperty({
        description: "Worker role ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    roleId: string;

    constructor(name: string, email: string, phone: string, roleId: string) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.roleId = roleId;
    }
}
