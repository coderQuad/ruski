const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schemas');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/ruski', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})


app.use('/graphql', graphqlHTTP({
  schema, 
  graphiql: true,
}));

app.listen(4000, () => {
    console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});