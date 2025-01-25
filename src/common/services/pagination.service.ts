import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  /**
   * Creates pagination metadata based on total items, current page, and limit.
   * @param totalItems - Total number of items.
   * @param currentPage - Current page number.
   * @param itemsPerPage - Number of items per page.
   * @returns Metadata for pagination.
   */
  createPaginationMeta(totalItems: number, currentPage: number, itemsPerPage: number) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      totalItems,
      itemCount: Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage),
      itemsPerPage,
      totalPages,
      currentPage,
    };
  }
}