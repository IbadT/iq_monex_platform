import { SpecificationResponseDto } from '../dto/response/specification.dto';

export class Specification {
  id: number;
  name: Record<string, string>;

  static fromPrisma(specification: Specification): Specification {
    return new Specification(specification.id, specification.name);
  }

  toResponse(lang: string = 'ru'): SpecificationResponseDto {
    return new SpecificationResponseDto(
      this.id,
      this.name[lang] || this.name['ru'],
    );
  }

  constructor(id: number, name: Record<string, string>) {
    this.id = id;
    this.name = name;
  }
}
