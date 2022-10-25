import dotenv from "dotenv";
import fetch from "node-fetch";
import { UserRes } from "./userRes.interface";


dotenv.config()


export class DbHelper {
    private url: string = encodeURI(process.env.GRAPHQL_URL!);
    private adminSecret: string = encodeURI(process.env.ADMIN_SECRET!)

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
}