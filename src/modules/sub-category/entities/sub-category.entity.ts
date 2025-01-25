import { Category } from "src/modules/category/entities/category.entity";
import { AbstractBaseEntity } from "src/database/mysql/entities/abstract.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { StatusEnum } from "src/enums/status.enum";

/**
 * Represents a subcategory of products within a category.
 * Each subcategory has a name, status, and a collection of associated products.
 * 
 * Relationships:
 * - One-to-many relationship with Product (a subcategory can have multiple products).
 * - Many-to-one relationship with Category (a subcategory belongs to one category).
 */
@Entity('sub_categories')
export class Subcategory extends AbstractBaseEntity {

  /**
   * The name of the subcategory. This field is required and should not exceed 64 characters.
   */
  @Column({ unique: true, type: 'varchar', length: 64 })
  name: string;

  /**
   * The status of the subcategory, which can be either 'ACTIVE' or 'INACTIVE'.
   * The default status is 'ACTIVE'.
   */
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  /**
   * A list of products associated with this subcategory. This field represents a one-to-many relationship 
   * where one subcategory can have multiple products.
   */
  @OneToMany(() => Product, (product) => product.subcategory)
  products: Product[];

  /**
   * The category to which this subcategory belongs. This field represents a many-to-one relationship
   * where each subcategory belongs to one category.
   */
  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category, (category) => category.products, {nullable:true})
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}

