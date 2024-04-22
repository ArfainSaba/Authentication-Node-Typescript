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
exports.verifyOTP = exports.regenerateOTP = exports.generateOTP = void 0;
const otpModels_1 = __importDefault(require("../models/otpModels"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
const expiringTime = parseInt(process.env.OTP_EXPIRE_TIME);
function isNumeric(value) {
    return /^\d+$/.test(value);
}
// sequelize.sync()
//   .then(() => {
//     console.log('Database synchronized successfully');
//   })
//   .catch((error) => {
//     console.error('Error synchronizing database:', error);
//   });
function generateOTP(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Inside generateOTP");
            const { mobile_number, country_code } = req.body;
            if (!mobile_number || !country_code || !isNumeric(mobile_number)) {
                return res.status(400).json({
                    id: "api.otp.generate",
                    ver: "1.0",
                    ts: new Date(),
                    params: {
                        err: "INVALID_REQUEST",
                        status: "Failed",
                        errmsg: "Mobile number and country code are required, and mobile number must contain only numeric digits"
                    },
                    responseCode: "BAD_REQUEST",
                    result: {}
                });
            }
            const existingOTP = yield otpModels_1.default.findOne({
                where: {
                    mobile_number,
                    expires_at: { [sequelize_1.Op.gt]: new Date() }
                }
            });
            if (existingOTP) {
                const currentTime = new Date();
                const remainingMilliseconds = existingOTP.expires_at.getTime() - currentTime.getTime();
                const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
                return res.status(400).json({
                    id: "api.otp.generate",
                    ver: "1.0",
                    ts: new Date(),
                    params: {
                        err: "OTP_NOT_EXPIRED",
                        status: "Failed",
                        errmsg: `Cannot generate new OTP. Please try again after ${remainingSeconds + 1} seconds.`
                    },
                    responseCode: "BAD_REQUEST",
                    result: {}
                });
            }
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + expiringTime);
            const otp = Math.floor(100000 + Math.random() * 900000);
            const newOTP = yield otpModels_1.default.create({
                id: (0, uuid_1.v4)(),
                mobile_number,
                country_code,
                otp,
                created_at: new Date(),
                expires_at: expiryTime
            });
            res.status(200).json({
                id: "api.otp.generate",
                ver: "1.0",
                ts: new Date(),
                params: {
                    err: null,
                    status: "successful",
                    errmsg: null,
                },
                responseCode: "OK",
                result: {
                    otp: otp,
                    id: newOTP.id
                }
            });
        }
        catch (error) {
            console.error('Error generating OTP:', error);
            res.status(500).json({
                otpID: "opt.generate",
                ver: "1.0",
                ts: new Date(),
                params: {
                    err: "SERVER_ERROR",
                    status: "Failed",
                    errmsg: "An error occurred while generating OTP"
                },
                responseCode: "SERVER_ERROR",
                result: {}
            });
        }
    });
}
exports.generateOTP = generateOTP;
function regenerateOTP(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const existingOTP = yield otpModels_1.default.findByPk(id);
            if (!existingOTP) {
                return res.status(404).json({
                    otpID: "api.opt.regenerate",
                    ver: "1.0",
                    ts: new Date(),
                    params: {
                        err: "NOT_FOUND",
                        status: "Failed",
                        errmsg: "Enter a valid OTP ID"
                    },
                    responseCode: "NOT_FOUND",
                    result: {}
                });
            }
            const currentTime = new Date();
            const remainingMilliseconds = existingOTP.expires_at.getTime() - currentTime.getTime();
            const remainingMinutes = Math.floor(remainingMilliseconds / (1000 * 60));
            const remainingSeconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);
            const remainingTime = `${remainingMinutes} minutes and ${remainingSeconds} seconds`;
            if (existingOTP.expires_at > currentTime) {
                return res.status(404).json({
                    otpID: "api.opt.regenerate",
                    ver: "1.0",
                    ts: new Date(),
                    params: {
                        err: "OTP_VALID",
                        status: "Failed",
                        errmsg: `OTP is still valid. Please try again after ${remainingTime}`
                    },
                    responseCode: "BAD_REQUEST",
                    result: {}
                });
            }
            const newOTP = Math.floor(100000 + Math.random() * 900000);
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + expiringTime);
            yield otpModels_1.default.update({
                created_at: currentTime,
                expires_at: expiryTime,
                otp: newOTP
            }, { where: { id } });
            res.status(200).json({
                id: "api.otp.regenerate",
                createdAt: currentTime,
                expiresAt: expiryTime,
                otp: newOTP,
                params: {
                    err: null,
                    status: "Success",
                    errmsg: null
                },
                responseCode: "OK",
                result: {
                    id: existingOTP.id
                }
            });
        }
        catch (error) {
            console.error('Error regenerating OTP:', error);
            res.status(500).json({
                otpID: "api.otp.regenerate",
                ver: "1.0",
                ts: new Date(),
                params: {
                    err: "SERVER_ERROR",
                    status: "Failed",
                    errmsg: "An error occurred while regenerating OTP"
                },
                responseCode: "SERVER_ERROR",
                result: {}
            });
        }
    });
}
exports.regenerateOTP = regenerateOTP;
function verifyOTP(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, otp } = req.body;
            console.log(req.body);
            if (!id || !otp) {
                return res.status(400).json({
                    id: "api.otp.verify",
                    ver: "1.0",
                    ts: new Date(),
                    params: {
                        err: "INVALID_REQUEST",
                        status: "Failed",
                        errmsg: "OTP ID and OTP are required"
                    },
                    responseCode: "BAD_REQUEST",
                    result: {}
                });
            }
            const existingOTP = yield otpModels_1.default.findByPk(id);
            if (!existingOTP) {
                return res.status(404).json({
                    id: "api.otp.verify",
                    ver: "1.0",
                    ts: new Date(),
                    params: {
                        err: "NOT_FOUND",
                        status: "Failed",
                        errmsg: "Invalid OTP ID"
                    },
                    responseCode: "NOT_FOUND",
                    result: {}
                });
            }
            if (existingOTP.otp !== otp) {
                return res.status(400).json({
                    id: "api.otp.verify",
                    ver: "1.0",
                    ts: new Date(),
                    params: {
                        err: "OTP_MISMATCH",
                        status: "Failed",
                        errmsg: "Invalid OTP"
                    },
                    responseCode: "BAD_REQUEST",
                    result: {}
                });
            }
            res.status(200).json({
                id: "api.otp.verify",
                ver: "1.0",
                ts: new Date(),
                params: {
                    err: null,
                    status: "Success",
                    errmsg: null
                },
                responseCode: "OK",
                result: {}
            });
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            res.status(500).json({
                id: "api.otp.verify",
                ver: "1.0",
                ts: new Date(),
                params: {
                    err: "SERVER_ERROR",
                    status: "Failed",
                    errmsg: "An error occurred while verifying OTP"
                },
                responseCode: "SERVER_ERROR",
                result: {}
            });
        }
    });
}
exports.verifyOTP = verifyOTP;
exports.default = { regenerateOTP, verifyOTP, generateOTP };
//# sourceMappingURL=otpServices.js.map