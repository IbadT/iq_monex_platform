import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class GetSpecificationDto {
  @IsEnum(Language, {
    message: 'Язык должен быть ru, en или kz',
  })
  @IsOptional()
  lang?: Language = Language.RU;
}
