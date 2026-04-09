import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, IsEnum } from "class-validator";

export enum LISTING_CONTACTS {
  USER,
  WORKER,
}

export class ListingContactDto {
  @ApiProperty({
    description: "ID контакта",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "Кто является контактом (WORKER или USER)",
    example: "WORKER",
    enum: LISTING_CONTACTS,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(LISTING_CONTACTS)
  type: string;

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }
}