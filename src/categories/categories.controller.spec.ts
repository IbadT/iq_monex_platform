import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoriesService: jest.Mocked<CategoriesService>;

  beforeEach(async () => {
    const mockCategoriesService = {
      categoriesList: jest.fn(),
      getCategoryTreeById: jest.fn(),
      subcategoriesList: jest.fn(),
      subsubcategoriesList: jest.fn(),
      seedCategories: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{
        provide: CategoriesService,
        useValue: mockCategoriesService,
      }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<jest.Mocked<CategoriesService>>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("categoriesList", () => {
    it("should return categories list", async () => {
      const result = [
        {
          id: 1,
          name: "Category 1",
          parentId: null,
          parent: null,
          children: [],
        }
      ];

      categoriesService.categoriesList.mockResolvedValue(result);

      const response = await controller.getCategories();
      expect(categoriesService.categoriesList).toHaveBeenCalled();
      expect(response).toEqual(result);
    })
  })
});
