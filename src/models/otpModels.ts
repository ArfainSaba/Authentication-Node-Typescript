import { Sequelize, DATE,STRING,NOW,DataTypes,Model, UUID } from 'sequelize';
import { v4 as UUIDV4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
const sequelize = new Sequelize(process.env.TABLE, process.env.DB_NAME, process.env.POSTGRES_PASSWORD, {
    dialect: 'postgres',
  });

interface OTPModel{
    id: string;
    mobile_number: string;
    country_code: string;
    created_at: Date;
    expires_at: Date;
  }

  interface OTPInstance extends Model<OTPModel,OTPModel>, OTPModel {}

  const OTP = sequelize.define<OTPInstance,OTPModel>('OTP', {
    id: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    mobile_number: {
      type: STRING,
      allowNull: false,
    },
    country_code: {
      type: STRING,
      allowNull: false,
    },
    created_at: {
      type: DATE,
      defaultValue: NOW,
    },
    expires_at: {
      type: DATE,
      allowNull: false,
    },
  }) ;
  export default OTP;