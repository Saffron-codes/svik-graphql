import express from "express";
import { ApolloServer } from '@apollo/server';

import { startStandaloneServer } from '@apollo/server/standalone';

import { resolvers } from "./resolvers/resolvers";
import { typeDefs } from "./schema/schema";



const PORT = Number(process.env.PORT) || 8080

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection:true
})

startStandaloneServer(server, {
    listen: {
        port: PORT
    }
}).then(res => {
    console.log(`🚀  Server ready at: ${res['url']}`);
})


