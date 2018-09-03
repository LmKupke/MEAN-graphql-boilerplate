import { ApolloServer, gql } from 'apollo-server-express';
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
import models from './models';
import schema from './graphql/schema';
import resolvers from './graphql/resolver';
const cors = require("cors");
const app = express();
app.use('*', cors());

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds141902.mlab.com:41902/chat-simple', { auth: {
  user: DB_USER,
  password: DB_PASSWORD
}, useNewUrlParser: true});


const server = new ApolloServer({
  // These will be defined for both new or existing servers
  schema,
  resolvers,
  context: async ({ req, connection  }) => {
    if (connection) {
      return {
        models,
      }
    }

    if (req) {

      return {
        models,
      }
    }
  },
  playground: {
    settings: {
      'editor.theme': 'dark',
      'editor.cursorShape': 'line'
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(3000, () =>
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
)
