import dotenv from "dotenv";
import * as EmailValidator from "email-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// import 'node-fetch';
import fetch from "node-fetch";
import { DbHelper } from "./dbHelper/dbHelper";
import { UserRes } from "./dbHelper/userRes.interface";

const dbHelper = new DbHelper();

dotenv.config()

//Auth helper class for auth routes


export class AuthHelper {
    url: string = encodeURI(process.env.GRAPHQL_URL!);
    adminSecret: string = encodeURI(process.env.ADMIN_SECRET!)
    async login(args: any): Promise<any> {
        let { email, password } = args;
        let jwt_secret_key = process.env.JWT_SECRET_KEY || '';
        let isEmailValidated = EmailValidator.validate(email);


        //validate email
        if (!isEmailValidated) {
            console.log('Invalid email');
            
            return { message: "Provide valid email", authenticated: false,data:''};

        }
        //fetching user from hasura
        let res:UserRes= await dbHelper.fetchUser(email);
        //check for errors
        if(res.err != ''){
            // throw new Error('User does not exist!');
            return {
                message:"User does not exist!",
                data:'',
                authenticated:false
            }   
        }
        const isEqual = await bcrypt.compare(password, res.user.password);
        if (!isEqual) {
            // throw new Error('Password is incorrect!');      
            return {
                message:"Password is incorrect!",
                data:"",
                authenticated:false
            }      
        }
        const payload = {
            'id':res.user.id,
            'email':email,
        }
        const token = jwt.sign(
            payload,
            jwt_secret_key,
            {
                expiresIn: "1h"
            },
        )
        if (token != null) {
            return { data: token, authenticated: true };

        } else {
            return { message: "Error", authenticated: false,data:'' };

        }
    }

}