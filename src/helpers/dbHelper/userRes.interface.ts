export interface UserRes {
    err:string,
    user:User
}

export interface User {
    id:string,
    name:string,
    email:string,
    password:string
}