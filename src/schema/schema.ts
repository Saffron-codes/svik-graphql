

export const typeDefs = `
type User {
    id:ID!
    name:String!
    email:String!
    photoUrl:String!
}
input UserIn {
    name:String!
    email:String!
    password:String!
    photoUrl:String!
}
type AuthData {
    data:String
    authenticated:Boolean
    message:String
}
type Query {
    login(email:String!,password:String!):AuthData!
}
type Mutation {
    signup(user:UserIn):AuthData
}
`;