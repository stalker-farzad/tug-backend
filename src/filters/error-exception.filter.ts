import { HttpException } from '@nestjs/common';

/**
 * Custom exception handler for HTTP errors with a standard response format.
 * This class allows throwing HTTP exceptions with a specific response structure 
 * that includes a success flag, message, result, meta data, and additional details.
 */
export class HandleException extends HttpException {
  /**
   * Creates an instance of the HandleHttpException class.
   * 
   * @param message - The error message to be returned in the response.
   * @param errorDetails - Detailed information about the error (default is an empty object).
   * @param status - The HTTP status code to be sent with the exception (e.g., HttpStatus.BAD_REQUEST).
   * @param meta - Metadata to be included in the response (optional, default is an empty object).
   */
  constructor(
    message: string,  
    status: any,         
    errorDetails: any = {},
    meta: Record<string, any> = {}, 
  ) {
    // Creating the custom error response object with a predefined structure.
    const errorResponse = {
      succeed: false,          
      message,               
      result: errorDetails,   
      meta: {...meta },    
    };
    
    // Call the parent HttpException constructor with the error response and HTTP status.
    super(errorResponse, status);
  }
}
