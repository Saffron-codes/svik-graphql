import { AuthHelper } from "../helpers/authHelper"

const authHelper = new AuthHelper();

export const resolvers = {
    Query: {
        login:async (_:any,args:Map<string,string>)=>authHelper.login(args),
    },
    Mutation: {
        signup:async(_:any,args:Map<string,string>)=>authHelper.signup(args)
    }
}