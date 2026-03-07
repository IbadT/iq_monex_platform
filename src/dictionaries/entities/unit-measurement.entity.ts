export class UnitMeasurement {
  id: number;
  name: Record<string, string>;

  static fromPrisma(unit: UnitMeasurement): UnitMeasurement {
    return new UnitMeasurement(unit.id, unit.name);
  }

  toResponse(lang: string = 'ru') {
    return {
      id: this.id,
      name: this.name[lang] || this.name['ru'],
    };
  }

  constructor(id: number, name: Record<string, string>) {
    this.id = id;
    this.name = name;
  }
}
