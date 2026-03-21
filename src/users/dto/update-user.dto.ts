import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
  IsUrl,
  MaxLength,
  ArrayMaxSize,
  IsNumber,
} from 'class-validator';
import { AddActivityToUserDto } from './add-activity-to-user.dto';
import { CreateWorkerDto } from '@/workers/dto/create-worker.dto';
import { CreateMapLocationDto } from '@/listings/dto/request/create-map-location.dto';

/**
 * Единый DTO для создания и редактирования профиля пользователя
 * Поля, помеченные как required: true в ApiProperty - обязательны всегда
 * Остальные поля опциональны
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Аватар пользователя (Base64)',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
  })
  @IsOptional()
  @IsString({ message: 'Аватар должен быть строкой Base64' })
  avatar: string | null;

  @ApiProperty({
    description: "ID типа юридического лица",
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'ID типа юридического лица обязателен' })
  @IsNumber({}, { message: 'ID типа юридического лица должен быть числом' })
  @Type(() => Number)
  legalEntityId: number;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иванов Иван Иванович',
    required: true,
  })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(50, { message: "Имя не должно превышать 50 символов" })
  name: string;

  @ApiProperty({
    description: 'ID валюты',
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'ID валюты обязателен' })
  @IsNumber({}, { message: 'ID валюты должен быть числом' })
  @Type(() => Number)
  currencyId: number;

  @ApiProperty({
    description: 'Сферы деятельности',
    type: [AddActivityToUserDto],
    required: true,
  })
  @IsArray({ message: 'Активности должны быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => AddActivityToUserDto)
  @ArrayMaxSize(5, { message: 'Максимум 5 видов деятельности' })
  activities: AddActivityToUserDto[];

  @ApiProperty({
    description: 'Телефон компании',
    example: '+79991234567',
    required: true,
  })
  @IsPhoneNumber()
  companyPhone: string | null;

  @ApiProperty({
    description: 'Email компании',
    example: 'info@company.com',
    required: true,
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  companyEmail: string | null;

  @ApiPropertyOptional({
    description: 'Telegram',
    example: '@username',
  })
  @IsString({ message: 'Telegram должен быть строкой' })
  telegram: string | null;

  @ApiPropertyOptional({
    description: 'Сайт компании',
    example: 'https://company.com',
  })
  @IsUrl({}, { message: 'Некорректный формат URL' })
  siteUrl: string | null;

  @ApiProperty({
    description: 'Описание компании',
    example: 'Компания занимается разработкой...',
    required: true,
  })
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(3000, { message: 'Описание не должно превышать 3000 символов' })
  description: string | null;

  @ApiProperty({
    description: 'Сотрудники',
    type: [CreateWorkerDto],
    required: true,
  })
  @IsArray({ message: 'Сотрудники должны быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => CreateWorkerDto)
  workers: CreateWorkerDto[] | [];

  @ApiPropertyOptional({
    description: 'Фотографии компании (Base64)',
    example: ['data:image/png;base64,iVBORw0KGgo...'],
    type: [String],
  })
  @IsArray({ message: 'Фотографии должны быть массивом' })
  @IsString({ each: true })
  @ArrayMaxSize(4, { message: 'Максимум 4 фотографии' })
  photos  : string[] | [];

  @ApiPropertyOptional({
    description: 'Файлы компании (Base64)',
    example: ['data:application/pdf;base64,JVBERi0xLjQKJcOk...'],
    type: [String],
  })
  @IsArray({ message: 'Файлы должны быть массивом' })
  @IsString({ each: true })
  @ArrayMaxSize(5, { message: 'Максимум 5 файлов' })
  files: string[] | [];

  @ApiProperty({
    description: 'Локации на карте',
    type: [CreateMapLocationDto],
    required: true,
  })
  @IsArray({ message: 'Локации должны быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => CreateMapLocationDto)
  maps: CreateMapLocationDto[] | [];

  constructor(
    avatar: string | null,
    legalEntityId: number,
    name: string,
    currencyId: number,
    activities: AddActivityToUserDto[],
    companyPhone?: string | null,
    companyEmail?: string | null,
    telegram?: string | null,
    siteUrl?: string | null,
    description?: string | null,
    workers?: CreateWorkerDto[] | [],
    photos?: string[] | [],
    files?: string[] | [],
    maps?: CreateMapLocationDto[] | [],
  ) {
    this.avatar = avatar;
    this.legalEntityId = legalEntityId;
    this.name = name;
    this.currencyId = currencyId;
    this.activities = activities;
    this.companyPhone = companyPhone || null;
    this.companyEmail = companyEmail || null;
    this.telegram = telegram || null;
    this.siteUrl = siteUrl || null;
    this.description = description || null;
    this.workers = workers || [];
    this.photos = photos || [];
    this.files = files || [];
    this.maps = maps || [];
  }
}



// name, activities, companyPhone, companyEmail, description, workers, maps, currencyId, legalEntityId


// import { CreateMapLocationDto } from '@/listings/dto/request/create-map-location.dto';
// import { CreateWorkerDto } from '@/workers/dto/create-worker.dto';
// import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
// import { AddActivityToUserDto } from './add-activity-to-user.dto';

// export class UpdateUserDto {
//   avatar: string;

//   @ApiProperty({
//     description: 'Имя пользователя',
//     example: 'Иванов Иван Иванович',
//     required: true,
//   })
//   @IsNotEmpty()
//   @IsString()
//   name: string;

//   @ApiProperty({
//     description: "ID валюты пользователя",
//     example: "123e4567-e89b-12d3-a456-426614174000",
//     required: true,
//   })
//   @IsNotEmpty()
//   @IsString()
//   @IsUUID()
//   currencyId: string;

//   @ApiProperty({
//     description: 'Сфера деятельности пользователя',
//     example: 'IT',
//     required: true,
//   })
//   activities: AddActivityToUserDto[];

//   companyPhone: string;

//   companyEmail: string;

//   telegram: string;

//   siteUrl: string;

//   description: string;

//   workers: CreateWorkerDto[];

//   photos: string[];

//   files: string[];

//   maps: CreateMapLocationDto[];

//   constructor(
//     avatar: string,
//     name: string, 
//     currencyId: string,
//     activities: AddActivityToUserDto[],
//     companyPhone: string,
//     companyEmail: string,
//     telegram: string,
//     siteUrl: string,
//     descriptin: string,
//     workers: CreateWorkerDto[],
//     photos: string[],
//     files: string[],
//     maps: CreateMapLocationDto[]
//   ) {
//     this.avatar = avatar;
//     this.name = name;
//     this.currencyId = currencyId;
//     this.activities = activities;
//     this.companyPhone = companyPhone;
//     this.companyEmail = companyEmail;
//     this.telegram = telegram;
//     this.siteUrl = siteUrl;
//     this.description = descriptin;
//     this.workers = workers;
//     this.photos = photos;
//     this.files = files;
//     this.maps = maps;
//   }
// }
