import express, { Request, Response,  } from 'express';
import { Sequelize } from 'sequelize';
import bodyParser from "body-parser";
import { generateOTP,regenerateOTP } from './services/otpServices';
import sequelize from './database/db';

 
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

// const sequelize = new Sequelize(process.env.TABLE, process.env.DB_NAME, process.env.POSTGRES_PASSWORD, {
//   dialect: 'postgres',
// });

app.post('/v1/otp/generate', async (req: Request, res: Response) => generateOTP(req, res, sequelize))

app.get('/v1/otp/regenerate/:id', async(req:Request, res:Response)=>regenerateOTP(req,res,sequelize))

const PORT = process.env.PORT ||3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
