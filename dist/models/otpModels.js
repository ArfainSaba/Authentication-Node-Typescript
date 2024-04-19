"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.TABLE, process.env.DB_NAME, process.env.POSTGRES_PASSWORD, {
    dialect: 'postgres',
});
const OTP = sequelize.define('OTP', {
    id: {
        type: sequelize_1.UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
    },
    mobile_number: {
        type: sequelize_1.STRING,
        allowNull: false,
    },
    country_code: {
        type: sequelize_1.STRING,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DATE,
        defaultValue: sequelize_1.NOW,
    },
    expires_at: {
        type: sequelize_1.DATE,
        allowNull: false,
    },
});
exports.default = OTP;
//# sourceMappingURL=otpModels.js.map