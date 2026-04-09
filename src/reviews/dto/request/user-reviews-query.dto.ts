import { PaginationDto } from "@/common/dto/pagintation.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsBoolean } from "class-validator";

export class UserReviewsQueryDto extends PaginationDto {
    
      @ApiPropertyOptional({
        description: 'Комментарии только с фото\n\ntrue - только с фото; false - только без фото',
        example: true,
      })
      @IsOptional()
      @IsBoolean()
      hasPhoto?: boolean;
    
      @ApiPropertyOptional({
        description: 'Отсортировать по дате создания\n\ntrue - сначала новые; false - сначала старые; null - игнорируем',
        example: true,
      })
      @IsOptional()
      @IsBoolean()
      newFirst?: boolean;
    
      @ApiPropertyOptional({
        description: 'Отсортировать по рейтингу\n\ntrue - сначала положительные; false - сначала негативные; null - игнорируем',
        example: true,
      })
      @IsOptional()
      @IsBoolean()
      positiveRateFirst?: boolean;
    
      constructor(limit: number, offset: number) {
        super(limit, offset);
      }
}