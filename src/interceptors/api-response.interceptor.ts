import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

interface ResponseStructure {
  succeed: boolean;
  message: string;
  result: any;
  meta: any;
}

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.succeed !== undefined && data.message !== undefined) {
          return data;
        }

        // Get the response object
        const response: Response = context.switchToHttp().getResponse();

        // Extract metadata, additional data, and other settings as needed
        const metas = this.getMetas();
        const additional = this.getAdditionalData();

        // Define the structure of the response
        const responseStructure: ResponseStructure = {
          succeed: !this.hasErrors(data),
          message: this.getMessage(data),
          result: data || [],
          meta: metas,
        };

        return responseStructure;
      }),
    );
  }

  // Helper Methods for Response Construction

  private getMetas(): any {
    return { timestamp: new Date().toISOString() };
  }

  private getAdditionalData(): any {
    return {};
  }

  private getMessage(data: any): string {
    return data?.message || 'Request was successful';
  }

  private hasErrors(data: any): boolean {
    return data?.error || false;
  }
}
