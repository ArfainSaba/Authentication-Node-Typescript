import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import OTP from '../models/otpModels';
import {v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv';

dotenv.config();

const expiringTime = parseInt( process.env.OTP_EXPIRE_TIME)
function isNumeric(value: any): boolean {
  return /^\d+$/.test(value);
}

export async function generateOTP(req: Request, res: Response, sequelize: Sequelize) {

    try {
        console.log("inside post");
        const { mobile_number, country_code } = req.body;

        if(!mobile_number && !country_code){
          return res.status(400).json({
            id:"api.otp.generatenerate",
            ver:"1.0",
            ts:new Date(),
            params:{
              err:"UNABLE_TO_SEND_OTP",
              status:"Failed",
              errmsg:"Mobile number and country code are requireed"
            },
            responseCode: "BAD_REQUEST",
            result:{}

          });
        }
        if(!mobile_number ){
          return res.status(400).json({
            id:"api.otp.generatenerate",
            ver:"1.0",
            ts:new Date(),
            params:{
              err:"UNABLE_TO_SEND_OTP",
              status:"Failed",
              errmsg:"Mobile number is required"
            },
            responseCode: "BAD_REQUEST",
            result:{}
          })
        }
        if(!country_code){
          return res.status(400).json({
          id:"api.otp.generatenerate",
          ver:"1.0",
          ts:new Date(),
          params:{
            err:"UNABLE_TO_SEND_OTP",
            status:"Failed",
            errmsg:"Country code is required"
          },
          responseCode: "BAD_REQUEST",
          result:{}})
        }

        if (!isNumeric(mobile_number)) {
          return res.status(400).json({ 
           id:"api.otp.generatenerate",
           ver:"1.0",
           ts:new Date(),
           params:{
             err:"UNABLE_TO_SEND_OTP",
             status:"Failed",
             errmsg:"Mobile number must contain only numeric digits"
           },
           responseCode: "BAD_REQUEST",
           result:{}
            });
     }
    
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() +expiringTime);
    
        const newOTP = await OTP.create({
          id: uuidv4(), 
          mobile_number,
          country_code,
          created_at: new Date(), 
          expires_at: expiryTime,
        });

        newOTP.save();

        res.status(200).json({
          id:"api.otp.generate",
          ver:"1.0",
          ts:new Date(),
          params:{
            err:null,
            status:"successful",
            errmsg:null,

          },
          resposneCode:"OK",
          result:{
            id:newOTP.id
          }
        });
      } catch (error) {
        
        console.error('Error generating OTP:', error);
        res.status(500).json({ 
          otpID:"opt.generate",
          ver:"1.0",
          ts:new Date(),
          params:{
            err:"CONNECTION_FAILED",
            status: "Failed",
            errmsg:"Connection to the server failed"
      },
      responseCode:"SERVER_ERROR",
      result:{}

         });
      }
}

export async function regenerateOTP(req: Request, res: Response, sequelize: Sequelize) {
    try {
      
        const { id } = req.params;
        
    
        const existingOTP = await OTP.findByPk(id);
        if (!existingOTP) {
          return res.status(404).json({ 
          otpID:"opt.generate",
          ver:"1.0",
          ts:new Date(),
          params:{
            err:"NOT_FOUND",
            status: "Failed",
            errmsg:"Enter a valid otp id"
      },
      responseCode:"NOT_FOUND",
      result:{}
    });
        }
        const currentTime= new Date();
        const remainingMilliseconds = existingOTP.expires_at.getTime() - currentTime.getTime();
        const remainingMinutes = Math.floor(remainingMilliseconds / (1000 * 60));
        const remainingSeconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);

        const remainingTime = `${remainingMinutes} minutes and ${remainingSeconds} seconds`;

        if(existingOTP.expires_at>currentTime){
          res.status(404).json({
            otpID:"api.opt.regenerate",
            ver:"1.0",
            ts:new Date(),
            params:{
              err:"OTP is still valid",
              status: "Failed",
              errmsg:`otp is still valid please try again after ${remainingTime}`
        },
        responseCode:"BAD_REQUEST",
        result:{}

      })
        }

        const newOTP = Math.floor(100000 + Math.random() * 900000);
    
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 5);
        await OTP.update({created_at:currentTime, expires_at: expiryTime }, { where: { id } }); 
    
        res.status(200).json({
          "id": "api.otp.generate",
          createdAt: currentTime.toISOString(),
          expiresAt: existingOTP.expires_at.toISOString(),
          params: {
            err: null,
            status: res,
            errmsg: null
          },
          responseCode: "OK",
          result: {
          id: existingOTP.id,
  }
        });
      } catch (error) {
        
        return;
      }
}
export default {regenerateOTP,generateOTP};