const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema } = require('graphql');
const { HelloType } = require('./objects');

var fakeDatabase = [
    { name:"world", id:1},
    { name: "graphql", id: 2},
    { name: "react", id: 3 }
]

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book 
//or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        hello: {
            type: HelloType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument by the user
                return fakeDatabase.find((item) => { return item.id == args.id});
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery
});