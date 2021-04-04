const { GraphQLObjectType, GraphQLString, GraphQLInt,
       GraphQLID,
       GraphQLList} = require('graphql');

const User = require('../models/user');

const UserType = new GraphQLObjectType({
    name: 'User', 
    fields: () => ({
        id: { type: GraphQLID },
        handle: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        elo: { type: GraphQLInt },
        friends: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({'_id': { $in: parent.friend_ids }});
            }
        }
    })
});

const GameType = new GraphQLObjectType({
    name: 'Game',
    fields: () => ({
        name: { type: GraphQLString }, 
        team1: { type: GraphQLString },
        id: { type: GraphQLID }
    })
});
 
module.exports = { UserType, GameType };