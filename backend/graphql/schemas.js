const { GraphQLObjectType, GraphQLID, GraphQLString, 
    GraphQLNonNull, GraphQLSchema, GraphQLList } = require('graphql');

const { HelloType } = require('./objects');

const Hello = require('../models/hello');


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
                return Hello.findById(args.id);
            }
        },
        hello: {
            type: new GraphQLList(HelloType),
            resolve(parent, args) {
                return Hello.find({}); 
            }
        }
    }
});


//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addHello:{
            type: HelloType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)}, // GraphQLNonNull makes field required
                tructus: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                let hello = new Hello({
                    name: args.name,
                    tructus: args.tructus
                })
                return hello.save();
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});