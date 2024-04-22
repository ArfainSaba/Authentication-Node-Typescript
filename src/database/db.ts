import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';



dotenv.config();
const sequelize = new Sequelize(process.env.TABLE, process.env.DB_NAME, process.env.POSTGRES_PASSWORD, {
    dialect: 'postgres',
  });

  

export default sequelize;
