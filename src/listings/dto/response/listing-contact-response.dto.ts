import { ApiProperty } from "@nestjs/swagger";

export class ListingContactResponseDto {
  @ApiProperty({
    description: "ID контакта",
    example: "123e4567-e89b-12d3-a456-426614174000",
    type: "string",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "Телефон контакта",
    example: "+7 777 123 45 67",
    type: "string",
  })
  phone: string | null;

  @ApiProperty({
    description: "Email контакта",
    example: "contact@example.com",
    type: "string",
  })
  email: string | null;

  @ApiProperty({
    description: "Тип контакта (USER или WORKER)",
    example: "WORKER",
    enum: ["USER", "WORKER"],
    type: "string",
  })
  type: string;

  constructor(
    id: string,
    phone: string | null,
    email: string | null,
    type: string,
  ) {
    this.id = id;
    this.phone = phone;
    this.email = email;
    this.type = type;
  }
}
