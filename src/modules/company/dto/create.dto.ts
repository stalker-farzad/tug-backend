import { IsString,IsOptional, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a new company.
 */
export class CreateCompanyDto {
  @ApiProperty({
    description: 'The name of the company (must be unique)',
    example: 'Tug Solutions Inc.',
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  name: string;

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
}
