import { AbstractBaseEntity } from "src/database/mysql/entities/abstract.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { StatusEnum } from "src/enums/status.enum";
import { Column, Entity,OneToMany } from "typeorm";

/**
 * Represents a category of products in the system.
 * Each category has a name, status, and a collection of associated products.
 * 
 * Relationships:
 * - One-to-many relationship with Product (a category can have multiple products).
 */
@Entity('categories')
export class Category extends AbstractBaseEntity {

  /**
   * The name of the category. This field is required and should not exceed 64 characters.
   */
  @Column({ unique: true, type: 'varchar', length: 64 })
  name: string;

  /**
   * The status of the category, which can be either 'ACTIVE' or 'INACTIVE'.
   * The default status is 'ACTIVE'.
   */
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  /**
   * A list of products associated with this category. This field represents a one-to-many relationship 
   * where one category can have multiple products.
   */
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}

