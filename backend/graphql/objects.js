const { GraphQLObjectType, GraphQLString, GraphQLInt,
       GraphQLID, GraphQLList} = require('graphql');

const User = require('../models/user');
const Player = require('../models/player');
const Comment = require('../models/comment');
const Game = require('../models/game');

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

const PlayerType = new GraphQLObjectType({
    name: 'Player',
    fields: () => ({
        id: { type: GraphQLID },
        cups: { type: GraphQLInt },
        penalties: { type: GraphQLInt },
        user_id: { type: GraphQLID } 
    })
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        timestamp: { type: GraphQLString },
        text: { type: GraphQLString },
        likes: { type: GraphQLInt },
        user_id: { type: GraphQLID }
    })
});

const GameType = new GraphQLObjectType({
    name: 'Game',
    fields: () => ({
        id: { type: GraphQLID },
        timestamp: { type: GraphQLString },
        location: { type: GraphQLString },
        description: { type: GraphQLString },
        likes: { type: GraphQLInt }, 
        winning_team: {
            type: new GraphQLList(PlayerType),
            resolve(parent, args){

            }
        },
        losing_team: {
            type: new GraphQLList(PlayerType),
            resolve(parent, args){

            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args){

            }
        }
    })
});
 
module.exports = { UserType, PlayerType, CommentType, GameType };