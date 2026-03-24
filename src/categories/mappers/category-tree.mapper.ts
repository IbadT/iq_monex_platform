import { CategoryTreeResponseDto } from '../dto/response/category-tree-response.dto';

export class CategoryTreeMapper {
  static mapToCategoryTreeDto(category: any): CategoryTreeResponseDto {
    return new CategoryTreeResponseDto(
      category.id,
      category.name,
      category.parentId,
      category.children?.map((child: any) =>
        this.mapToCategoryTreeDto(child),
      ) || null,
    );
  }
}
