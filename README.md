
# TUG Nestjs Backend Project

## 1. Clone the Repository

To get started with the project, follow these steps:

1. Clone the project repository from GitHub:

```bash
git clone https://github.com/stalker-farzad/tug-backend.git
```

2. Navigate into the project directory:

```bash
cd tug-backend
```

3. (Optional) If you want to work on a specific branch, switch to that branch:

```bash
git checkout main
```

4. Ensure you have the necessary environment variables set up. You may need to create a `.env` file based on `.env.example` or according to the documentation provided in the project.

Now you are ready to install dependencies and set up the project.

## 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
pnpm install
```

or if you are using Yarn:

```bash
yarn install
```

## 3. Set Up the Database

This project uses **MySQL** for data storage. Make sure you have MySQL version **9.x** installed.

1. Create a new database for the project.

2. Set up your database connection in the `.env` file by adding the following:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_DATABASE=yourdatabase
DATABASE_SYNCHRONIZE=false
```

3. In the development environment, sample data will be automatically inserted into the category and subcategory tables during migration. This helps you get started with predefined categories and subcategories for testing purposes.

4. Important for Production: The DATABASE_SYNCHRONIZE setting controls whether TypeORM automatically synchronizes the database schema with your entities.In production, always keep this value as false to prevent accidental schema changes that could lead to data loss.

5. Seeders for Development Only: The project includes seeders that populate the database with initial data, such as categories and subcategories. These seeders are executed only in the development environment and are not intended for production. This ensures that your production data remains clean and is not overwritten with test data.

## 4. Set Up Redis

This project uses **Redis** for caching to improve performance. Make sure Redis is installed and running on your machine.

1. To install Redis, you can follow the installation instructions based on your operating system. For example:

```bash
sudo apt update
sudo apt install redis-server
```

2. After installation, ensure Redis is running. You can check Redis status by using the following command:

```bash
redis-cli ping
```

3. Set up the connection to Redis in the .env file. Add the following lines to configure the Redis server:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=yourpassword (optional)
REDIS_TTL=3600  # Cache time-to-live in seconds
```

4. Once Redis is set up, the project will use it for caching data to improve performance. Redis caching is integrated into the project, and it will automatically store and retrieve data as needed.

## 5. Start the Development Server

Once the dependencies are installed and the database is set up, you can start the development server by running:

```bash
pnpm run start:dev
```

or if using Yarn:

```bash
yarn start:dev
```

The server will now be running on `http://localhost:3000`.

## 6. Run Unit Tests

To ensure the functionality of the application, you can run the unit tests using the following commands:

```bash
pnpm run test
```

or if using Yarn:

```bash
yarn test
```

## 7. Document (Swagger)

Once the project is running, the project documentation will be available at [http://localhost:3000/api/docs](http://localhost:3000/api/docs) via Swagger.

> **Note**: To use the APIs, you must authenticate. Use the username and password, both of which are set to `admin` by default.

## 8. Contributing

If you want to contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a pull request.