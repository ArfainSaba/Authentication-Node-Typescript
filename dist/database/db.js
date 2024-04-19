"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Define your Sequelize instance and connection parameters
const sequelize = new sequelize_1.Sequelize("otp_details", "postgres", "arfainsabapostgres", {
    dialect: 'postgres',
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map