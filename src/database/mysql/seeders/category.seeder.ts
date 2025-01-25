import { Category } from 'src/modules/category/entities/category.entity';
import { Subcategory } from 'src/modules/sub-category/entities/sub-category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEnum } from 'src/enums/status.enum';

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  /**
   * Seeds both Category and Subcategory entities.
   * First, it ensures that all categories exist. Then, it creates subcategories 
   * and associates them with the appropriate category by looking up categoryId.
   */
  async seed() {
    // Define categories to be seeded
    const categories = [
      { name: 'Electronics', status: StatusEnum.ACTIVE },
      { name: 'Clothing', status: StatusEnum.ACTIVE },
      { name: 'Home Appliances', status: StatusEnum.ACTIVE },
      { name: 'Books', status: StatusEnum.ACTIVE },
    ];

    // Seed categories and get the saved category instances
    const savedCategories = await Promise.all(
      categories.map(async (category) => {
        let existingCategory = await this.categoryRepository.findOne({
          where: { name: category.name },
        });
        if (!existingCategory) {
          existingCategory = await this.categoryRepository.save(category);
        }
        return existingCategory;
      })
    );

    // Define subcategories to be seeded
    const subcategories = [
      { name: 'Smartphones', categoryName: 'Electronics', status: StatusEnum.ACTIVE },
      { name: 'Laptops', categoryName: 'Electronics', status: StatusEnum.ACTIVE },
      { name: 'Men’s Clothing', categoryName: 'Clothing', status: StatusEnum.ACTIVE },
      { name: 'Women’s Clothing', categoryName: 'Clothing', status: StatusEnum.ACTIVE },
      { name: 'Refrigerators', categoryName: 'Home Appliances', status: StatusEnum.ACTIVE },
      { name: 'Washing Machines', categoryName: 'Home Appliances', status: StatusEnum.ACTIVE },
      { name: 'Fiction', categoryName: 'Books', status: StatusEnum.ACTIVE },
      { name: 'Non-Fiction', categoryName: 'Books', status: StatusEnum.ACTIVE },
    ];
    
    // Seed subcategories, linking them to the correct categoryId
    for (const subcategory of subcategories) {
      const category = savedCategories.find(
        (cat) => cat.name === subcategory.categoryName,
      );

      if (category) {
        const existingSubcategory = await this.subcategoryRepository.findOne({
          where: { name: subcategory.name },
        });

        if (!existingSubcategory) {
          // Save subcategory with the correct categoryId
          const subcategoryData = {
            ...subcategory,
            categoryId: category.id, // Correctly set categoryId
          };

          // Save the subcategory
          await this.subcategoryRepository.save(subcategoryData);
        }
      }
    }
  }
}
