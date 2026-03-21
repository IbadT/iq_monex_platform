import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class GetLegalEntityTypesDto {
  @ApiProperty({
    description: 'описание',
    example: 'ru',
    required: false,
  })
  @IsEnum(Language, {
    message: 'Язык должен быть ru, en или kz',
  })
  @IsOptional()
  lang?: Language = Language.RU;

  constructor(lang: Language) {
    this.lang = lang;
  }
}
