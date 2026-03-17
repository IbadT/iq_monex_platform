import { RoleType } from "@/users/enums/role-type.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsIn, IsNotEmpty, IsString } from "class-validator";
import { rolesCode } from "@/users/default/roleData";

export class CreateRoleDto {
    @ApiProperty({
        description: "Роль пользователя для отображения",
        example: "Менеджер",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({
        description: "Код роли пользователя",
        example: "MANAGER",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsIn(rolesCode)
    code: string;
    
    @ApiProperty({
        description: "Тип роли пользователя",
        example: RoleType.WORKER,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsEnum(RoleType)
    type: RoleType;

    constructor(role: string, code: string, type: RoleType) {
        this.role = role;
        this.code = code;
        this.type = type;
    }
}
