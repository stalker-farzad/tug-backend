import { databaseDefaultConfig } from 'src/config/database.config';
import { DataSource } from 'typeorm';

/**
 * DatabaseService is a singleton class responsible for managing the TypeORM DataSource.
 * It initializes the database connection and provides access to repositories for entities.
 */
class DatabaseService {
  private static instance: DataSource;

  // Private constructor to prevent instantiation
  private constructor() {}

  /**
   * Initializes the database connection if it hasn't been initialized yet.
   * @param entities - An array of entity classes to be used in the database.
   * @returns {Promise<DataSource>} The initialized DataSource instance.
   */
  static async initialize(entities: any[]): Promise<DataSource> {
    if (!DatabaseService.instance) {
      // Create a new DataSource instance with the default configuration and provided entities
      DatabaseService.instance = new DataSource({
        ...databaseDefaultConfig,
        entities,
      });

      // Initialize the DataSource (connect to the database)
      await DatabaseService.instance.initialize();
    }
    return DatabaseService.instance;
  }

  /**
   * Retrieves the repository for the specified entity.
   * @param entity - The entity class for which the repository is needed.
   * @returns {Repository<T>} The repository for the specified entity.
   * @throws Error if the database has not been initialized.
   */
  static getRepository<T>(entity: { new (): T }) {
    if (!DatabaseService.instance) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return DatabaseService.instance.getRepository(entity);
  }
}

export default DatabaseService;