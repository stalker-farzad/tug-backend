import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * ResponseTransformInterceptor is a global interceptor that transforms the response data 
 * to the desired DTO class after the request has been handled.
 */
@Injectable()
export class ResponseTransformInterceptor {
  constructor(private reflector: Reflector) {}

  /**
   * Intercepts the response data, transforms it using the specified response class (DTO),
   * and returns the transformed data.
   * @param context - The execution context of the request
   * @param next - The next handler to execute the response processing
   * @returns An observable that emits the transformed response data
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Retrieve the response class (DTO) associated with the handler
        const responseClass = this.getResponseClass(context);

        // Check if the responseClass is defined and is a valid class constructor
        if (responseClass && this.isClassConstructor(responseClass)) {
          // Transform the response data into the corresponding class instance
          const transformedData = plainToClass(responseClass, data, {
            excludeExtraneousValues: true, // Only include properties marked with @Expose()
          });
          return transformedData;
        }

        // If no responseClass or invalid class constructor, return the original data
        return data;
      }),
    );
  }

  /**
   * Retrieves the response class (DTO) from the handler's metadata.
   * If not found, returns undefined.
   * @param context - The execution context of the request
   * @returns The response class (DTO) or undefined if not found
   */
  private getResponseClass(context: ExecutionContext): ClassConstructor<any> | undefined {
    const handler = context.getHandler();
    // Use Reflector to get the 'responseClass' metadata associated with the handler
    return this.reflector.get<ClassConstructor<any>>('responseClass', handler) || undefined;
  }

  /**
   * Checks if the given class is a valid class constructor.
   * It ensures that the class is not just a function but a class that can be instantiated.
   * @param cls - The class or function to check
   * @returns True if the provided class is a valid class constructor, false otherwise
   */
  private isClassConstructor(cls: any): boolean {
    // Check if the provided class is a function and if it represents a class
    return typeof cls === 'function' && /^class\s/.test(cls.toString());
  }
}