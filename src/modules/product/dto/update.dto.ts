import { IsString, IsNumber, IsOptional, Min, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { StatusEnum } from 'src/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO to update an existing product.
 */
export class UpdateProductDto {
    @ApiProperty({
        description: 'The name of the product (optional)',
        example: 'Updated Product ABC',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'The description of the product (optional)',
        example: 'Updated description of Product ABC',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The price of the product (optional)',
        example: 120,
        required: false,
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'The barcode of the product (optional)',
        example: '1234567890134',
        required: false,
    })
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty({
        description: 'The quantity available in stock (optional)',
        example: 100,
        required: false,
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    stockQuantity?: number;

    @ApiProperty({
        description: 'The ID of the company that owns the product',
        type: String,
        required: true,
        example: "de5d80a7-c70b-4cc2-a6f0-b74e10ab8141"
    })
    @IsNotEmpty()
    @IsUUID()
    companyId?: string;

    @ApiProperty({
        description: 'The ID of the category that the product belongs to',
        type: String,
        example: "de5d80a7-c70b-4cc2-a6f0-b74e10ab8141"
    })
    @IsNotEmpty()
    @IsUUID()
    categoryId: string;

    @ApiProperty({
        description: 'The ID of the optional subcategory that the product belongs to (optional)',
        type: String,
        required: false,
        default: null
    })
    @IsOptional()
    @IsUUID()
    subcategoryId?: string;

    @ApiProperty({
        description: 'The status of the product',
        enum: StatusEnum,
        default: StatusEnum.ACTIVE,
        example: StatusEnum.ACTIVE,
        required: false,
    })
    @IsOptional()
    @IsEnum(StatusEnum)
    status?: StatusEnum;
}
