import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import OTP from '../models/otpModels';
import {v4 as uuidv4 } from 'uuid'

function isNumeric(value: any): boolean {
  return /^\d+$/.test(value);
}

export async function generateOTP(req: Request, res: Response, sequelize: Sequelize) {
  const t= await sequelize.transaction();
    try {
        console.log("inside post");
        const { mobile_number, country_code } = req.body;
        if (!isNumeric(mobile_number)) {
          return res.status(400).json({ error: 'Mobile number must contain only numeric digits' });
      }

        if(!mobile_number && !country_code){
          return res.status(400).send('Mobile number and Country code are required');
        }
        if(!mobile_number ){
          return res.status(400).send('Mobile number is required');
        }
        if(!country_code){
          return res.status(400).send('Country code  is required');
        }
    
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    
        const newOTP = await OTP.create({
          id: uuidv4(), 
          mobile_number,
          country_code,
          created_at: new Date(), 
          expires_at: expiryTime,
        });
        await t.commit();

        res.status(200).json({"OtpId":newOTP.id});
      } catch (error) {
        
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Error connecting to database' });
      }
}

export async function regenerateOTP(req: Request, res: Response, sequelize: Sequelize) {
    try {
      
        const { id } = req.params;
        
    
        const existingOTP = await OTP.findByPk(id);
        if (!existingOTP) {
          return res.status(400).json({ message: 'Invalid OTP ID' });
        }
        const currentTime= new Date();
        if(existingOTP.expires_at>currentTime){
          res.status(400).json({message: "otp is still valid please try again after 5 minuites"})
        }
        const newOTP = Math.floor(100000 + Math.random() * 900000);
    
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 5);
        await OTP.update({created_at:currentTime, expires_at: expiryTime }, { where: { id } });
       
    
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
      } catch (error) {
        
        return;
      }
}
export default {regenerateOTP,generateOTP};