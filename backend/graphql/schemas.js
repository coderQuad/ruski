const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, 
    GraphQLNonNull, GraphQLSchema, GraphQLList } = require('graphql');

const { EloType, UserType, PlayerType, CommentType, GameType } = require('./objects');

const mongoose = require('mongoose');

const User = require('../models/user');
const Player = require('../models/player');
const Comment = require('../models/comment');
const Game = require('../models/game');
const Elo = require('../models/elo');

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book 
//or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        /* Elo Queries */
        elo: {
            type: EloType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return Elo.findById(args.id);
            }
        },
        elos: {
            type: new GraphQLList(EloType),
            resolve(parent, args) {
                return Elo.find({});
            }
        },

        /* User Queries */
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } }, 
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        userByEmail: {
            type: new GraphQLList(UserType),
            args: { email: { type: GraphQLString} },
            resolve(parent, args) { 
                return User.find({email: args.email});
            }
        },
        userByHandle: {
            type: new GraphQLList(UserType),
            args: { handle: { type: GraphQLString} },
            resolve(parent, args) { 
                return User.find({handle: args.handle});
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({}); 
            }
        },

        /* Player Queries */
        player: {
            type: PlayerType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Player.findById(args.id);
            }
        },
        players: {
            type: new GraphQLList(PlayerType),
            resolve(parent, args) {
                return Player.find({});
            }
        },

        /* Comment Queries */
        comment: {
            type: CommentType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Comment.findById(args.id);
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args){
                return Comment.find({});
            }
        },

        /* Game Queries */
        game: {
            type: GameType,
            args: { id: {type: GraphQLID }},
            resolve(parent, args) {
                return Game.findById(args.id);
            }
        },
        games: {
            type: new GraphQLList(GameType),
            resolve(parent, args){
                return Game.find( {} );
            }
        }
    }
});


//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        /* Elo Mutations */
        addElo: {
            type: EloType,
            args: {
                elo: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let elo = new Elo({
                    elo: args.elo
                });
                return elo.save();
            }
        },
        updateElo: {
            type: EloType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                elo: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                return Elo.findByIdAndUpdate(
                    args.id,
                    {
                        elo: args.elo
                    }
                );
            }
        },
        deleteElo: {
            type: EloType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Elo.findByIdAndDelete(args.id);
            }
        },

        /* User Mutations */
        addUser: {
            type: UserType,
            args:{
                handle: { type: new GraphQLNonNull(GraphQLString)}, // GraphQLNonNull makes field required
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString) },
                elo: { type: new GraphQLNonNull(GraphQLInt) },
                friend_ids: {type: new GraphQLList(GraphQLID)},
                profile_url: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                let user = new User({
                    handle: args.handle,
                    name: args.name,
                    email: args.email,
                    elo: args.elo,
                    friend_ids: args.friend_ids,
                    profile_url: args.profile_url
                });
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},
                handle: { type: new GraphQLNonNull(GraphQLString)}, // GraphQLNonNull makes field required
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString) },
                elo: { type: new GraphQLNonNull(GraphQLInt)},
                friend_ids: {type: new GraphQLList(GraphQLID)},
                profile_url: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                return User.findByIdAndUpdate(
                    args.id,
                    {
                        handle: args.handle,
                        name: args.name,
                        email: args.email,
                        elo: args.elo,
                        friend_ids: args.friend_ids,
                        profile_url: args.profile_url
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
        },

        /* Player Mutations */
        addPlayer: {
            type: PlayerType,
            args: {
                cups: { type: new GraphQLNonNull(GraphQLInt) },
                penalties: { type: new GraphQLNonNull(GraphQLInt)},
                user_id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let player = new Player({
                    cups: args.cups,
                    penalties: args.penalties,
                    user_id: args.user_id
                });
                
                return player.save();
            }
        },
        updatePlayer: {
            type: PlayerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)},
                cups: { type: new GraphQLNonNull(GraphQLInt)},
                penalties: { type: new GraphQLNonNull(GraphQLInt)},
                user_id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Player.findByIdAndUpdate(
                    args.id,
                    {
                        cups: args.cups,
                        penalties: args.penalties,
                        user_id: args.user_id
                    }
                );
            }
        },
        deletePlayer: {
            type: PlayerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return player.findByIdAndDelete(args.id);
            }
        },

        /* Comment Mutations */
        addComment: {
            type: CommentType,
            args: {
                text: {type: new GraphQLNonNull(GraphQLString)},
                user_id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let comment = new Comment({
                    text: args.text,
                    likes: 0,
                    liked_by_ids: [],
                    user_id: args.user_id
                });

                return comment.save();
            }
        },
        updateComment: {
            type: CommentType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)},
                text: { type: new GraphQLNonNull(GraphQLString)},
                user_id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Comment.findById(args.id)
                    .then(response => {
                        Comment.findByIdAndUpdate(
                        args.id,
                        {
                            text: args.text,
                            likes: response.likes,
                            user_id: args.user_id,
                            liked_by_ids: response.liked_by_ids
                        }
                );
                });
            }
        },
        deleteComment: {
            type: CommentType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Comment.findByIdAndDelete(args.id);
            }
        },

        /* Game Mutations */
        addGame: {
            type: GameType,
            args: {
                location: { type: GraphQLString },
                description: { type: new GraphQLNonNull(GraphQLString)},
                winning_team_player_ids: {type: new GraphQLList(GraphQLID)},
                losing_team_player_ids: {type: new GraphQLList(GraphQLID)}
           },
            resolve(parent, args){
                let game = new Game({
                    location: args.location, 
                    description: args.description,
                    likes: 0,
                    winning_team_player_ids: args.winning_team_player_ids,
                    losing_team_player_ids: args.losing_team_player_ids,
                    comment_ids: [],
                    liked_by_ids: []
                });

                return game.save();
            }
        },
        updateGame: {
            type: GameType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                location: {type: GraphQLString},
                description: { type: new GraphQLNonNull(GraphQLString)},
                winning_team_player_ids: {type: new GraphQLList(GraphQLID)},
                losing_team_player_ids: {type: new GraphQLList(GraphQLID)}
            },
            resolve(parent, args){
                return Game.findById(args.id)
                    .then( response => {
                        return Game.findByIdAndUpdate(
                        args.id,
                        {
                            location: args.location,
                            description: args.description,
                            winning_team_player_ids: args.winning_team_player_ids,
                            losing_team_player_ids: args.losing_team_player_ids,
                            comment_ids: response.comment_ids,
                            likes: response.likes,
                            liked_by_ids: response.liked_by_ids
                        }
                        );
                    });
            }
        },
        deleteGame: {
            type: GameType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Game.findByIdAndDelete(args.delete);
            }
        },

        /* Special Mutations */
        incrementGameLike: {
            type: GameType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                liked_by_id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Game.findById(args.id)
                    .then(response => {
                        let new_liked_by_id = mongoose.Types.ObjectId(args.liked_by_id);
                        response.liked_by_ids.push(new_liked_by_id);
                        return Game.findByIdAndUpdate(
                            args.id, 
                            {
                                winning_team_player_ids: response.winning_team_player_ids,
                                losing_team_player_ids: response.losing_team_player_ids,
                                location: response.location,
                                description: response.description,
                                comment_ids: response.comment_ids,
                                likes: response.likes + 1,
                                liked_by_ids: response.liked_by_ids
                            }
                        );
                    });
            }
        },
        decrementGameLike: {
            type: GameType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                liked_by_id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Game.findById(args.id)
                    .then(response => {
                        let new_liked_by_id = mongoose.Types.ObjectId(args.liked_by_id);
                        response.liked_by_ids.push(new_liked_by_id);
                        return Game.findByIdAndUpdate(
                            args.id, 
                            {
                                winning_team_player_ids: response.winning_team_player_ids,
                                losing_team_player_ids: response.losing_team_player_ids,
                                location: response.location,
                                description: response.description,
                                comment_ids: response.comment_ids,
                                likes: response.likes - 1,
                                liked_by_ids: response.liked_by_ids
                            }
                        );
                    });
            }
        },
        incrementCommentLike: {
            type: CommentType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                liked_by_id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Comment.findById(args.id)
                    .then(response => {
                        let new_liked_by_id = mongoose.Types.ObjectId(args.liked_by_id);
                        response.liked_by_ids.push(new_liked_by_id);
                        return Comment.findByIdAndUpdate(
                            args.id, 
                            {
                                text: response.text,
                                user_id: response.user_id,
                                likes: response.likes + 1,
                                liked_by_ids: response.liked_by_ids
                            }
                        );
                    });
            }
        },
        decrementCommentLike: {
            type: CommentType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                liked_by_id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Comment.findById(args.id)
                    .then(response => {
                        let new_liked_by_id = mongoose.Types.ObjectId(args.liked_by_id);
                        response.liked_by_ids.push(new_liked_by_id);
                        return Comment.findByIdAndUpdate(
                            args.id, 
                            {
                                text: response.text,
                                user_id: response.user_id,
                                likes: response.likes - 1,
                                liked_by_ids: response.liked_by_ids
                            }
                        );
                    });
            }
        },
        addFriend: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                friend_id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return User.findById(args.id)
                    .then(response => {
                        let new_friend_id = mongoose.Types.ObjectId(args.friend_id);
                        response.friend_ids.push(new_friend_id);
                        return User.findByIdAndUpdate(
                            args.id,
                            {
                                handle: response.handle,
                                name: response.name,
                                email: response.email,
                                elo: response.elo,
                                elo_history_ids: response.elo_history_ids,
                                friend_ids: response.friend_ids
                            }
                        );
                    });
            }
        },
        modifyEmail: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                email: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return User.findById(args.id)
                    .then(response => {
                        return User.findByIdAndUpdate(
                            args.id,
                            {
                                handle: response.handle,
                                name: response.name,
                                email: args.email,
                                elo: response.elo,
                                elo_history_ids: response.elo_history_ids,
                                friend_ids: response.friend_ids
                            }
                        );
                    });
            }
        },
        modifyProfileURL: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                profile_url: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return User.findById(args.id)
                    .then(response => {
                        return User.findByIdAndUpdate(
                            args.id,
                            {
                                handle: response.handle,
                                name: response.name,
                                email: response.email,
                                elo: response.elo,
                                elo_history_ids: response.elo_history_ids,
                                friend_ids: response.friend_ids,
                                profile_url: args.profile_url
                            }
                        );
                    });
            }
        },
        modifyHandle: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                handle: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return User.findById(args.id)
                    .then(response => {
                        return User.findByIdAndUpdate(
                            args.id,
                            {
                                handle: args.handle,
                                name: response.name,
                                email: response.email,
                                elo: response.elo,
                                elo_history_ids: response.elo_history_ids,
                                friend_ids: response.friend_ids
                            }
                        );
                    });
            }
        },
        addComment: {
            type: GameType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                comment_id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Game.findById(args.id)
                    .then(response => {
                        let new_comment_id = mongoose.Types.ObjectId(args.friend_id);
                        response.comment_ids.push(new_comment_id);
                        return Game.findByIdAndUpdate(
                            args.id,
                            {
                                winning_team_player_ids: response.winning_team_player_ids,
                                losing_team_player_ids: response.losing_team_player_ids,
                                location: response.location,
                                description: response.description,
                                comment_ids: response.comment_ids,
                                likes: response.likes
                            }
                        )
                    });
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