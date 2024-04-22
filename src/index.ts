import express, { Request, Response,  } from 'express';
import { generateOTP,regenerateOTP,verifyOTP } from './services/otpServices';

const PORT = process.env.PORT ||3001
 
const app = express();
app.use(express.json());

app.post('/v1/otp/generate', async (req: Request, res: Response) => generateOTP(req, res))

app.get('/v1/otp/regenerate/:id', async(req:Request, res:Response)=>regenerateOTP(req,res))

app.post('/v1/otp/verify',async (req:Request, res:Response)=>verifyOTP(req,res));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
