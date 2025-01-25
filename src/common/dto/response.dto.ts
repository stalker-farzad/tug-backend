import { ApiProperty } from '@nestjs/swagger';

/**
 * A generic response DTO that can be used for different entities.
 * @param T The type of the result data (e.g., Company, User, etc.)
 */
export class ResponseDto<T> {
  @ApiProperty({
    description: 'Indicates whether the operation was successful',
    example: true,
  })
  succeed: boolean;

  @ApiProperty({
    description: 'Message describing the result of the operation',
    example: 'Operation was successful',
  })
  message: string;

  @ApiProperty({
    description: 'The actual data returned by the operation',
    type: () => Object,
  })
  result: T;

  @ApiProperty({
    description: 'Optional metadata for pagination or additional information',
    required: false,
  })
  meta?: any;
}
