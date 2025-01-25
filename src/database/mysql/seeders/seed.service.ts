import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CategorySeeder } from './category.seeder';

@Injectable()
export class SeederService implements OnModuleInit {
  private static isSeeded = false; // Flag to ensure seeding happens only once
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly categorySeeder: CategorySeeder,
  ) {}
  
  /**
   * Executes seeder methods only once based on a static flag.
   * If the flag is false, it will run the seeder and set the flag to true.
   */
  async onModuleInit() {
    try {
      // Ensure seeding happens only once
      if (!SeederService.isSeeded) {
        if (process.env.NODE_ENV === 'development') {
          await this.categorySeeder.seed();
          SeederService.isSeeded = true; // Set the flag to true after seeding
          this.logger.debug('Seeder completed successfully.');
        }
      } else {
        this.logger.debug('Seeding has already been completed.');
      }
    } catch (error) {
      this.logger.error('Error while seeding:', error);
    }
  }
}
