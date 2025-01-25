import { AbstractBaseEntity } from 'src/database/mysql/entities/abstract.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Column, Entity,OneToOne } from 'typeorm';
import { StatusEnum } from 'src/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a company entity in the database.
 * Extends the AbstractBaseEntity for common properties like id, timestamps, and soft delete.
 */
@Entity({ name: 'companies' })
export class Company extends AbstractBaseEntity {
  /**
   * Name of the company (must be unique and cannot be null).
   */
  @ApiProperty({
    description: 'The name of the company',
    example: 'Tech Solutions Inc.',
    maxLength: 128,
  })
  @Column({nullable: false, type: 'varchar', length: 128 })
  name: string;

  /**
   * Address of the company (nullable).
   */
  @ApiProperty({
    description: 'The address of the company',
    example: '123 Tech Road, Silicon Valley, CA',
    required: false,
  })
  @Column({ nullable: true, type: 'varchar', length: 255 })
  address: string;

  /**
   * Phone number of the company (nullable).
   */
  @ApiProperty({
    description: 'The phone number of the company',
    example: '+1 123 456 7890',
    required: false,
  })
  @Column({ nullable: true, type: 'varchar', length: 64 })
  phone: string;

  /**
   * Website of the company (nullable).
   */
  @ApiProperty({
    description: 'The website of the company',
    example: 'https://www.techsolutions.com',
    required: false,
  })
  @Column({ nullable: true, type: 'varchar', length: 128 })
  website: string;
  
  /**
   * Status of the company, can be 'active' or 'inactive'.
   * Default value is 'active'.
   */
  @ApiProperty({
    description: 'The status of the company',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
    example: StatusEnum.ACTIVE,
  })
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  /**
   * One-to-one relationship with the Product entity.
   * Each company can optionally be associated with one product.
   */
  @ApiProperty({
    description: 'The product associated with the company',
    type: () => Product,
    required: false,
  })
  @OneToOne(() => Product, (product) => product.company, { nullable: true })
  product: Product;
}
