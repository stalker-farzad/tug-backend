import { ExceptionFilter, Catch, ArgumentsHost, InternalServerErrorException } from '@nestjs/common';

/**
 * Custom exception filter to handle InternalServerErrorException.
 * This filter catches errors of type InternalServerErrorException and formats the response
 * with a generic error message and the actual error message.
 */
@Catch(InternalServerErrorException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: InternalServerErrorException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const status = exception.getStatus();
        response.status(status).json({
            statusCode: status,
            message: 'An error occurred while processing your request. Please try again later.',
            error: exception.message,
        });
    }
}
