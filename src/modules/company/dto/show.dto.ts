import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class ShowCompanyDto{
    @ApiProperty({ example: true, description: 'Indicates success or failure' })
    succeed: boolean;

    @ApiProperty({ example: 'Companies fetched successfully', description: 'Response message' })
    message: string;

    @ApiProperty( {type: [Company]})
    result: Company[];
}
