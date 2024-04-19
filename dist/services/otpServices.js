"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateOTP = exports.generateOTP = void 0;
const otpModels_1 = __importDefault(require("../models/otpModels"));
const uuid_1 = require("uuid");
function isNumeric(value) {
    return /^\d+$/.test(value);
}
function generateOTP(req, res, sequelize) {
    return __awaiter(this, void 0, void 0, function* () {
        const t = yield sequelize.transaction();
        try {
            console.log("inside post");
            const { mobile_number, country_code } = req.body;
            if (!isNumeric(mobile_number)) {
                return res.status(400).json({ error: 'Mobile number must contain only numeric digits' });
            }
            if (!mobile_number && !country_code) {
                return res.status(400).send('Mobile number and Country code are required');
            }
            if (!mobile_number) {
                return res.status(400).send('Mobile number is required');
            }
            if (!country_code) {
                return res.status(400).send('Country code  is required');
            }
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + 5);
            const newOTP = yield otpModels_1.default.create({
                id: (0, uuid_1.v4)(),
                mobile_number,
                country_code,
                created_at: new Date(),
                expires_at: expiryTime,
            });
            yield t.commit();
            res.status(200).json({ "OtpId": newOTP.id });
        }
        catch (error) {
            console.error('Error generating OTP:', error);
            res.status(500).json({ message: 'Error connecting to database' });
        }
    });
}
exports.generateOTP = generateOTP;
function regenerateOTP(req, res, sequelize) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const existingOTP = yield otpModels_1.default.findByPk(id);
            if (!existingOTP) {
                return res.status(400).json({ message: 'Invalid OTP ID' });
            }
            const currentTime = new Date();
            if (existingOTP.expires_at > currentTime) {
                res.status(400).json({ message: "otp is still valid please try again after 5 minuites" });
            }
            const newOTP = Math.floor(100000 + Math.random() * 900000);
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + 5);
            yield otpModels_1.default.update({ created_at: currentTime, expires_at: expiryTime }, { where: { id } });
            // res.status(200).json({ otpId: existingOTP.id, expiresAt: existingOTP.expires_at });
            res.status(200).json({
                id: existingOTP.id,
                createdAt: currentTime.toISOString(),
                expiresAt: existingOTP.expires_at.toISOString(),
                params: {
                    "err": null,
                    "status": res,
                    "errmsg": null
                },
                "responseCode": "OK",
                "result": {
                    "id": "dataset_id"
                }
            });
        }
        catch (error) {
            return;
        }
    });
}
exports.regenerateOTP = regenerateOTP;
exports.default = { regenerateOTP, generateOTP };
//# sourceMappingURL=otpServices.js.map