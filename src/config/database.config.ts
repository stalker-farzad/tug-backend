import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';
config();

/**
 * This configuration registers the database connection settings in the NestJS application.
 * It retrieves values from environment variables and provides default values if the variables are not set.
 * 
 * The configuration is registered under the 'database' namespace and is used to configure the database connection
 * in various parts of the application (e.g., TypeORM setup).
 */
export default registerAs('database', () => (databaseDefaultConfig));

export const databaseDefaultConfig: MysqlConnectionOptions = {

  /**
   * The type of database connection. Set to 'mysql' for MySQL.
   */
  type: 'mysql',

  /**
   * The host of the database. Defaults to 'localhost' if not set in environment variables.
   */
  host: process.env.DATABASE_HOST || 'localhost',

  /**
   * The port of the database. Defaults to 3306 (default MySQL port) if not set in environment variables.
   * It is parsed as an integer.
   */
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,

  /**
   * The username for the database connection. Defaults to 'root' if not set in environment variables.
   */
  username: process.env.DATABASE_USERNAME || 'root',

  /**
   * The password for the database connection. Defaults to 'password' if not set in environment variables.
   */
  password: process.env.DATABASE_PASSWORD || 'password',

  /**
   * The name of the database to connect to. Defaults to 'test' if not set in environment variables.
   */
  database: process.env.DATABASE_NAME || 'test',

  /**
   * Whether to synchronize the database schema automatically. Defaults to 'false' unless explicitly set to 'true' in environment variables.
   * This is typically set to 'false' in production to avoid unwanted schema changes.
   */
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',

  /**
   * Whether to enable logging for database queries. It is enabled ('true') in the 'development' environment, 
   * and disabled ('false') in other environments (e.g., 'production').
   */
  logging: process.env.DATABASE_LOGGING === 'true' || false,
};

