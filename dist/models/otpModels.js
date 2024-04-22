"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../database/db"));
// import { NUMBER } from 'sequelize';
dotenv_1.default.config();
const OTP = db_1.default.define('OTP', {
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
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
});
exports.default = OTP;
//# sourceMappingURL=otpModels.js.map