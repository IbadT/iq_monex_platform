import {
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingSpecificationDto {
  @ApiProperty({
    description: 'ID характеристики из справочника',
    example: 1,
    required: true,
  })
  @IsNumber()
  specificationId: number;

  @ApiProperty({
    description: 'Значение характеристики',
    example: 'Белый',
    required: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  value: string;

  @ApiProperty({
    description:
      'Пользовательская характеристика (true) или глобальная (false)',
    example: false,
    required: true,
    default: false,
  })
  @IsBoolean()
  isCustom: boolean = false;

  constructor(specificationId: number, value: string, isCustom: boolean) {
    this.specificationId = specificationId;
    this.value = value;
    this.isCustom = isCustom;
  }
}
