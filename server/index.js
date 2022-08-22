require('dotenv').config(); //to use dotenv files
const express = require('express');
const colors = require('colors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000; //either listen from .env or port 5000
const app = express(); //init express server

connectDB(); //connect to database

app.use(
  '/graphql',
  graphqlHTTP({
    //creating the graphql endpoint
    schema,
    graphiql: process.env.NODE_ENV === 'development', //bool value, check from dotenv
  })
);

app.listen(port, console.log(`on port ${port}`));
