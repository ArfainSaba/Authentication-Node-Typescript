import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
// Define your Sequelize instance and connection parameters
const sequelize = new Sequelize("otp_details", "postgres", "arfainsabapostgres", {
    dialect: 'postgres',
  });

export default sequelize;
