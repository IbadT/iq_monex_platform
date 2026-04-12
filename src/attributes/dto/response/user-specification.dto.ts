import { ApiProperty } from '@nestjs/swagger';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';

export class UserSpecificationResponseDto {
  @ApiProperty({
    description: 'ID характеристики',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Название характеристики на выбранном языке',
    example: 'Моя кастомная характеристика',
  })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromPrisma(
    spec: { id: number; name: Record<string, string>; },
    lang: Language,
  ): UserSpecificationResponseDto {
    return new UserSpecificationResponseDto(
      spec.id,
      spec.name[lang] || spec.name['ru'] || Object.values(spec.name)[0] || '',
    );
  }
}
