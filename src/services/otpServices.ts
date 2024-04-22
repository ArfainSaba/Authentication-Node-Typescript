import { Request, Response } from 'express';
import OTP from '../models/otpModels';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import sequelize from '../database/db';
import { Op } from 'sequelize';
dotenv.config();

const expiringTime = parseInt(process.env.OTP_EXPIRE_TIME);

function isNumeric(value: any): boolean {
  return /^\d+$/.test(value);
}


export async function generateOTP(req: Request, res: Response) {
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

    const existingOTP = await OTP.findOne({
      where: {
        mobile_number,
        expires_at: { [Op.gt]: new Date() }
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
          errmsg: `Cannot generate new OTP. Please try again after ${remainingSeconds +1} seconds.`
        },
        responseCode: "BAD_REQUEST",
        result: {}
      });
    }

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + expiringTime);
    const otp = Math.floor(100000 + Math.random() * 900000);

    const newOTP = await OTP.create({
      id: uuidv4(),
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
  } catch (error) {
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
}


export async function regenerateOTP(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const existingOTP = await OTP.findByPk(id);
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

    await OTP.update({
      created_at: currentTime, 
      expires_at: expiryTime ,
      otp:newOTP
    }, { where: { id } });

    res.status(200).json({
      id: "api.otp.regenerate",
      createdAt: currentTime,
      expiresAt: expiryTime,
      otp:newOTP,
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
  } catch (error) {
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
}

export async function verifyOTP(req: Request, res: Response) {
  
  try {
    const { id, otp } = req.body;
    console.log(req.body)
  

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

  const existingOTP = await OTP.findByPk(id);
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
} catch (error) {
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
}

export default { regenerateOTP, verifyOTP,generateOTP };
