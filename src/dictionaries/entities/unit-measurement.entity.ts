import { UnitMeasurementResponseDto } from '../dto/response/user-measurement-response.dto';

export class UnitMeasurement {
  id: number;
  name: Record<string, string>;

  static fromPrisma(unit: UnitMeasurement): UnitMeasurement {
    return new UnitMeasurement(
      unit.id,
      typeof unit.name === 'string' ? JSON.parse(unit.name) : unit.name,
    );
  }

  toResponse(lang: string = 'ru'): UnitMeasurementResponseDto {
    return new UnitMeasurementResponseDto(
      this.id,
      this.name[lang] || this.name['ru'],
    );
    // return {
    //   id: this.id,
    //   name: this.name[lang] || this.name['ru'],
    // };
  }

  constructor(id: number, name: Record<string, string>) {
    this.id = id;
    this.name = name;
  }
}
