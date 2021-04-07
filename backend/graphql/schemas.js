const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, 
    GraphQLNonNull, GraphQLSchema, GraphQLList } = require('graphql');

const { UserType, PlayerType, CommentType, GameType } = require('./objects');

const User = require('../models/user');
const Player = require('../models/player');
const Comment = require('../models/comment');
const Game = require('../models/game');

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book 
//or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        /* User Queries */
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
            args: { ids: { type: GraphQLList(GraphQLID)}},
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
            args: { ids: { type: GraphQLList(GraphQLID)}},
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
                });
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
                cups: { type: GraphQLInt},
                penalties: { type: GraphQLInt},
                user_id: { type: GraphQLID}
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
                    user_id: args.user_id
                });

                return comment.save();
            }
        },
        updateComment: {
            type: CommentType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)},
                text: { type: GraphQLString},
                user_id: { type: GraphQLID}
            },
            resolve(parent, args){
                return Comment.findByIdAndUpdate(
                    args.id,
                    {
                        text: args.text,
                        likes: 0,
                        user_id: args.user_id
                    }
                );
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
                    comment_ids: []
                });

                return game.save();
            }
        },
        updateGame: {
            type: GameType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                location: {type: GraphQLString},
                description: { type: GraphQLString},
                winning_team_player_ids: {type: new GraphQLList(GraphQLID)},
                losing_team_player_ids: {type: new GraphQLList(GraphQLID)}
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