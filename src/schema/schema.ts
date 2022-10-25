

export const typeDefs = `
type User {
    id:ID!
    name:String!
    email:String!
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
    signup(name:String!,email:String!,password:String!):User
}
`;