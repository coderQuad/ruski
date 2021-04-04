const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, 
    GraphQLNonNull, GraphQLSchema, GraphQLList } = require('graphql');

const { UserType, GameType } = require('./objects');

const User = require('../models/user');


//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book 
//or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } }, 
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({}); 
            }
        }
    }
});


//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        /* User Mutations */
        addUser: {
            type: UserType,
            args:{
                handle: { type: new GraphQLNonNull(GraphQLString)}, // GraphQLNonNull makes field required
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: GraphQLString },
                elo: { type: GraphQLInt },
                friend_ids: {type: new GraphQLList(GraphQLID)}
            },
            resolve(parent,args){
                let user = new User({
                    handle: args.handle,
                    name: args.name,
                    email: args.email,
                    elo: args.elo,
                    friend_ids: args.friend_ids
                })
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},
                handle: { type: GraphQLString}, // GraphQLNonNull makes field required
                name: { type: GraphQLString},
                email: { type: GraphQLString },
                elo: { type: GraphQLInt },
                friend_ids: {type: new GraphQLList(GraphQLID)}
            },
            resolve(parent,args){
                return User.findByIdAndUpdate(
                    args.id,
                    {
                        handle: args.handle,
                        name: args.name,
                        email: args.email,
                        elo: args.elo,
                        friend_ids: args.friend_ids
                    }
                );
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                return User.findByIdAndDelete( args.id );
            }
        }


        /* Game Mutations */
        
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});