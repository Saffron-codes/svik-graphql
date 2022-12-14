"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
    type Query {
        animals:[String]
    }

    type Mutation {
        insertAnimal(name:String):String
    }

    type Subscription {
        onNewAnimal:[String!]
    }
`;
