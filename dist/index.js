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
const express_1 = __importDefault(require("express"));
const otpServices_1 = require("./services/otpServices");
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/v1/otp/generate', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, otpServices_1.generateOTP)(req, res); }));
app.get('/v1/otp/regenerate/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, otpServices_1.regenerateOTP)(req, res); }));
app.post('/v1/otp/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, otpServices_1.verifyOTP)(req, res); }));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map