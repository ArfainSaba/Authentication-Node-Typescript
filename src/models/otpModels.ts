import { Sequelize, DATE,STRING,NOW,DataTypes,Model, UUID } from 'sequelize';
import { v4 as UUIDV4 } from 'uuid';
import dotenv from 'dotenv';

import sequelize from "../database/db";

dotenv.config();

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