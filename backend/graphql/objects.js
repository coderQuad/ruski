const { GraphQLObjectType, GraphQLString, GraphQLInt,
    GraphQLID, GraphQLList } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

const User = require('../models/user');
const Player = require('../models/player');
const Comment = require('../models/comment');
const Elo = require('../models/elo');

const EloType = new GraphQLObjectType({
    name: 'Elo',
    fields: () => ({
        id: { type: GraphQLID },
        elo: { type: GraphQLInt },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        handle: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        elo: { type: GraphQLInt },
        elo_history: {
            type: new GraphQLList(EloType),
            resolve(parent, args) {
                return Elo.find({ '_id': { $in: parent.elo_history_ids } });
            }
        },
        friends: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ '_id': { $in: parent.friend_ids } });
            }
        },
        profile_url: { type: GraphQLString }
    })
});

const PlayerType = new GraphQLObjectType({
    name: 'Player',
    fields: () => ({
        id: { type: GraphQLID },
        cups: { type: GraphQLInt },
        penalties: { type: GraphQLInt },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user_id);
            }
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },
        text: { type: GraphQLString },
        likes: { type: GraphQLInt },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.user_id);
            }
        },
        liked_by: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ '_id': { $in: parent.liked_by_ids } });
            }
        }
    })
});

const GameType = new GraphQLObjectType({
    name: 'Game',
    fields: () => ({
        id: { type: GraphQLID },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },
        location: { type: GraphQLString },
        description: { type: GraphQLString },
        likes: { type: GraphQLInt },
        winning_team: {
            type: new GraphQLList(PlayerType),
            resolve(parent, args) {
                return Player.find({ '_id': { $in: parent.winning_team_player_ids } });
            }
        },
        losing_team: {
            type: new GraphQLList(PlayerType),
            resolve(parent, args) {
                return Player.find({ '_id': { $in: parent.losing_team_player_ids } });
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                console.log(parent.comment_ids);
                return Comment.find({ '_id': { $in: parent.comment_ids } });
            }
        },
        liked_by: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ '_id': { $in: parent.liked_by_ids } });
            }
        }
    })
});

module.exports = { EloType, UserType, PlayerType, CommentType, GameType };