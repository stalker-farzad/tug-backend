import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { StatusEnum } from 'src/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for updating an existing company.
 */
export class UpdateCompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'Tech Solutions Inc.',
    maxLength: 128,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name?: string;

  @ApiProperty({
    description: 'The address of the company',
    example: '123 Tech Road, Silicon Valley, CA',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'The phone number of the company',
    example: '+1 123 456 7890',
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'The website of the company',
    example: 'https://www.techsolutions.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    description: 'The status of the company',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
    example: StatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}
