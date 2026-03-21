import { ApiProperty } from '@nestjs/swagger';

export interface MeasurementCategory {
  category: string;
  units: string[];
}

export class MeasurementsGroupsResponseDto {
  @ApiProperty({
    description: 'Сгруппированные единицы измерений по категориям',
    example: {
      'количество штук': ['за штуку', 'за единицу', 'за комплект'],
      вес: ['за грамм (г)', 'за килограмм (кг)', 'за тонну (т)'],
      объем: ['за литр (л)', 'за миллилитр (мл)'],
      длина: ['за метр (м)', 'за километр (км)'],
      площадь: ['за квадратный метр (м²)', 'за гектар'],
      время: ['за час', 'за день', 'за месяц'],
      'цифровые услуги': ['за гигабайт', 'за запрос'],
      транспорт: ['за доставку', 'за рейс'],
    },
  })
  categories: Record<string, string[]>;

  @ApiProperty({
    description: 'Список всех спецификаций',
    example: ['Площадь', 'Количество', 'Вес', 'Цвет', 'Материал', 'Состояние'],
  })
  specifications: string[];

  constructor(categories: Record<string, string[]>, specifications: string[]) {
    this.categories = categories;
    this.specifications = specifications;
  }
}
