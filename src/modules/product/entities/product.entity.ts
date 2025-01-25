import { AbstractBaseEntity } from "src/database/mysql/entities/abstract.entity";
import { Category } from "src/modules/category/entities/category.entity";
import { Subcategory } from "src/modules/sub-category/entities/sub-category.entity";
import { Company } from "src/modules/company/entities/company.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { StatusEnum } from "src/enums/status.enum";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Represents a product in the system.
 * Each product has a name, description, price, barcode, associated company, category, and optional subcategory.
 * 
 * Relationships:
 * - Many-to-one relationship with Company (a product can belong to one company).
 * - Many-to-one relationship with Category (each product must belong to one category).
 * - Many-to-one relationship with Subcategory (a product can optionally belong to a subcategory).
 */
@Entity('products')
export class Product extends AbstractBaseEntity {

  /**
   * The name of the product. This field is required and should not exceed 255 characters.
   */
  @ApiProperty({
    description: 'The name of the product',
    example: 'Smartphone',
    maxLength: 255,
  })
  @Column({ nullable: false, type: 'varchar', length: 255 })
  name: string;

  /**
   * A description of the product. This field is optional and can store longer text.
   */
  @ApiProperty({
    description: 'A detailed description of the product',
    example: 'A high-end smartphone with advanced features',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * The price of the product. This field is required and uses decimal type for accurate price representation.
   * It allows up to 10 digits in total, with 2 digits after the decimal point.
   */
  @ApiProperty({
    description: 'The price of the product',
    example: 999.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  /**
   * A unique barcode for the product. This field is required and has a length of 64 characters.
   */
  @ApiProperty({
    description: 'Unique barcode for the product',
    example: '1234567890123456',
    maxLength: 64,
  })
  @Column({ type: 'varchar', length: 64 })
  barcode: string;

  /**
   * Status of the product, can be 'active' or 'inactive'.
   * Default value is 'active'.
   */
  @ApiProperty({
    description: 'The current status of the product',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
    example: StatusEnum.ACTIVE,
  })
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  /**
   * The company that owns this product. This field is optional.
   * If a product belongs to a company, it can have a many-to-one relationship with the Company entity.
   */
  @ApiProperty({
    description: 'The company that owns the product',
    type: () => Company,
    required: false,
  })
  @ManyToOne(() => Company, (company) => company.product)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: false })
  companyId?: string;

  /**
   * The category to which the product belongs. Every product must have a category.
   * This field establishes a many-to-one relationship with the Category entity.
   */
  @ApiProperty({
    description: 'The category that the product belongs to',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column({ nullable: false })
  categoryId?: string;

  /**
   * The optional subcategory to which the product belongs. This field is optional.
   * It establishes a many-to-one relationship with the Subcategory entity.
   */
  @ApiProperty({
    description: 'The optional subcategory that the product belongs to',
    type: () => Subcategory,
    required: false,
  })
  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, { nullable: true })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: Subcategory;

  @Column({ nullable: true })
  subcategoryId?: string;

  /**
   * The stock quantity of the product. This field is required and represents the number of items in stock.
   */
  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
  })
  @Column({ type: 'int', nullable: false, default: 0 })
  stockQuantity: number;
}