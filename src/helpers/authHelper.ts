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
let jwt_secret_key = process.env.JWT_SECRET_KEY || '';

export class AuthHelper {
    async login(args: any): Promise<any> {
        let { email, password } = args;
        let isEmailValidated = EmailValidator.validate(email);


        //validate email
        if (!isEmailValidated) {
            console.log('Invalid email');

            return { message: "Provide valid email", authenticated: false, data: '' };

        }
        //fetching user from hasura
        let res: UserRes = await dbHelper.fetchUser(email);
        //check for errors
        if (res.err != '') {
            // throw new Error('User does not exist!');
            return {
                message: "User does not exist!",
                data: '',
                authenticated: false
            }
        }
        const isEqual = await bcrypt.compare(password, res.user.password);
        if (!isEqual) {
            // throw new Error('Password is incorrect!');      
            return {
                message: "Password is incorrect!",
                data: "",
                authenticated: false
            }
        }
        const payload = {
            'id': res.user.id,
            'email': email,
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
            return { message: "Error", authenticated: false, data: '' };

        }
    }

    async signup(args: any): Promise<any> {
        args = args['user']
        let { name, email, password, photoUrl } = args;

        //check for existing user data
        const checkIfUserExists = await dbHelper.checkifUserExists(email);
        //if exists return an error message
        if (checkIfUserExists) {
            return {
                authenticated: false,
                message: 'User Already Exists',
                data: ''
            }
        }

        // if not hash the password
        const hashedPassword = bcrypt.hashSync(password, 12);
        args['password'] = hashedPassword;
        // insert user data
        const res = await dbHelper.saveUserData(args);
        // console.log(JSON.stringify(res));
        
        //jwt sign

        const payload = {
            'id': JSON.parse(JSON.stringify(res))['id'],
            'email': email,
        }
        const token = jwt.sign(
            payload,
            jwt_secret_key,
            {
                expiresIn: "1h"
            },
        )
        if (token != null) {
            return { data: token, authenticated: true ,message:''};
        } else {
            return { message: "Error", authenticated: false, data: '' };

        }

        // return created user
    }

}