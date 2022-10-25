import dotenv from "dotenv";
import fetch from "node-fetch";
import { UserRes } from "./userRes.interface";


dotenv.config()


export class DbHelper {
    private url: string = encodeURI(process.env.GRAPHQL_URL as string);
    private adminSecret: string = process.env.ADMIN_SECRET as string;

    private headers = {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': this.adminSecret
    }

    async fetchUser(email: string): Promise<UserRes> {
        var userRes: UserRes = { err: '', user: { id: '', email: '', password: '', name: '' } };
        //graphql query for login validation
        const query = `
                query Login($email:String!) {
                    users(where: {email: {_eq: $email}}) {
                        id
                        name
                        email
                        password
                    }
                }
            `;

        const variables = {
            email: email
        }

        // console.log(body);
        await fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ query, variables }),
        })
            .then((response: any) => response.json())
            //Then with the data from the response in JSON...
            .then((data: any) => {
                var res = JSON.parse(JSON.stringify(data));
                // console.log(res['data']['users'][0] != null);
                if (res['data']['users'][0] == null) {
                    userRes.err = 'User does not exist';
                }
                userRes.user = res['data']['users'][0];
            })
            //Then with the error genereted...
            .catch((error: any) => {
                userRes.err = error;
                userRes.user = userRes.user;
            });
        return userRes;
    }

    async saveUserData(args: any): Promise<Map<string, string>> {
        let { name, email, password, photoUrl } = args;
        var response:Map<string,string> = new Map();
        // insert user data into hasura graphql
        const mutation = `
            mutation Signup($name:String!,$email:String!,$password:String!,$photo_url:String!) {
                insert_users_one(object: {name: $name, email: $email, password: $password, photo_url: $photo_url}) {
                    id
                    name
                    email
                    password
                }
            }
        `;
        const variables = {
            name: name,
            email: email,
            password: password,
            photo_url: photoUrl
        }

        await fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ query: mutation, variables }),
        })
            .then((response: any) => response.json())
            //Then with the data from the response in JSON...
            .then((data: any) => {
                var res = JSON.parse(JSON.stringify(data));
                response = res['data']['insert_users_one'] as Map<string,string>;
            })
            .catch((error: any) => {
                console.log(error);
                response = error;
            });
        return response!;
    }

    async checkifUserExists(email: string):Promise<boolean> {
        const query = `
            query CheckUserExists($email:String!) {
                users_aggregate(where: {email: {_eq: $email}}) {
                    aggregate {
                        count(columns: email)
                    }
                }
            }
        `;
        const variables = { email };
        var count = 0;

        await fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ query: query, variables }),
        })
            .then((response: any) => response.json())
            //Then with the data from the response in JSON...
            .then((data: any) => {
                var res = JSON.parse(JSON.stringify(data));
                // response = res['data']['insert_users_one'];
                count = res['data']['users_aggregate']['aggregate']['count'];
                // console.log(count);
            })
            .catch((error: any) => {
                console.log(error);
                // response = error;
                throw "Network Error";
            });
        return count>0;

    }
}