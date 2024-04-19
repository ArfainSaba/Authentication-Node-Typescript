import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
// Define your Sequelize instance and connection parameters
const sequelize = new Sequelize(process.env.TABLE, process.env.DB_NAME, process.env.POSTGRES_PASSWORD, {
    dialect: 'postgres',
  });

export default sequelize;
