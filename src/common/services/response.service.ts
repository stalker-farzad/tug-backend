import { Injectable } from '@nestjs/common';

/**
 * Service for creating consistent API responses.
 * Provides methods for successful and error responses with optional metadata.
 */
@Injectable()
export class ResponseService {
  
  /**
   * Creates a success response.
   * @param message - The message to send with the response.
   * @param data - The data to include in the response.
   * @param meta - Optional metadata (e.g., pagination info).
   * @returns A structured success response.
   */
  success(message = 'Request was successful', data: any = [], meta: any = {}) {
    return {
      succeed: true,
      message,
      result: data,
      meta: meta,
    };
  }

  /**
   * Creates an error response.
   * @param message - The message to send with the error.
   * @param errorDetails - Detailed information about the error.
   * @param meta - Optional metadata (e.g., pagination info).
   * @returns A structured error response.
   */
  error(message = 'An error occurred', errorDetails: any = {}, meta: any = {}) {
    return {
      succeed: false,
      message,
      result: errorDetails,
      meta: meta,
    };
  }
}