import { IsNumber, IsString, MinLength, MaxLength } from 'class-validator';
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

  constructor(specificationId: number, value: string) {
    this.specificationId = specificationId;
    this.value = value;
  }
}
