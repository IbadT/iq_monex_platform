import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, ValidateIf, IsOptional, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export enum ActivityAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    IGNORE = 'IGNORE',
}

export class AddActivityToUserDto {
    @ApiProperty({
        description: "ID существующей активности (если указан, используется существующая активность)",
        example: 1,
        required: false,
    })
    @IsOptional()
    @ValidateIf((o) => !o.activity) // Валидировать только если нет activity и действие не IGNORE
    @IsNumber()
    @Type(() => Number)
    id?: number;

    @ApiProperty({
        description: "Название новой активности (если указано, создастся новая активность и присвоится пользователю)",
        example: "Программирование",
        required: false,
    })
    @IsOptional()
    @ValidateIf((o) => !o.id) // Валидировать только если нет id и действие не IGNORE
    @IsString()
    @IsNotEmpty()
    activity?: string;

    @ApiProperty({
        description: "Действие с активностью",
        example: ActivityAction.CREATE,
        required: true,
    })
    @IsEnum(ActivityAction)
    action: ActivityAction;

    constructor(action: ActivityAction, id?: number, activity?: string) {
        this.action = action;
        if (id !== undefined) {
            this.id = id;
        }
        if (activity !== undefined) {
            this.activity = activity;
        }
    }
}