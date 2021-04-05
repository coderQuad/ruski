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
                return Player.find({'_id': { $in: args.ids }});
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
                return Comment.find({'_id': { $in: args.ids }});
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
                return Comment.find( {} );
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

        /* Game Mutations */
        addGame: {
            type: GameType,
            args: {
                location: { type: GraphQLString },
                description: { type: new GraphQLNonNull(GraphQLString)},
                winner_1_cups: { type: new GraphQLNonNull(GraphQLInt)},
                winner_1_penalties: { type: new GraphQLNonNull(GraphQLInt)},
                winner_1_user_id: { type: new GraphQLNonNull(GraphQLID)},
                winner_2_cups: { type: new GraphQLNonNull(GraphQLInt)},
                winner_2_penalties: { type: new GraphQLNonNull(GraphQLInt)},
                winner_2_user_id: { type: new GraphQLNonNull(GraphQLID)},
                loser_1_cups: { type: new GraphQLNonNull(GraphQLInt)},
                loser_1_penalties: { type: new GraphQLNonNull(GraphQLInt)},
                loser_1_user_id: { type: new GraphQLNonNull(GraphQLID)},
                loser_2_cups: { type: new GraphQLNonNull(GraphQLInt)},
                loser_2_penalties: { type: new GraphQLNonNull(GraphQLInt)},
                loser_2_user_id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){

                let game = new Game({
                    location: args.location, 
                    description: args.description,
                    likes: 0,
                    winning_team_player_ids: [],
                    losing_team_player_ids: [],
                    comment_ids: []
                });

                let winner_1 = new Player({
                    cups: args.winner_1_cups, 
                    penalties: args.winner_1_penalties,
                    user_id: args.winner_1_user_id
                });
                let winner_2 = new Player({
                    cups: args.winner_2_cups, 
                    penalties: args.winner_2_penalties,
                    user_id: args.winner_2_user_id
                });

                winner_1.save()
                    .then(response => game.winning_team_player_ids.push(response._id));
                winner_2.save()
                    .then(response => game.winning_team_player_ids.push(response._id));

                let loser_1 = new Player({
                    cups: args.loser_1_cups, 
                    penalties: args.loser_1_penalties,
                    user_id: args.loser_1_user_id
                });
                let loser_2 = new Player({
                    cups: args.loser_2_cups, 
                    penalties: args.loser_2_penalties,
                    user_id: args.loser_2_user_id
                });

                loser_1.save()
                    .then(response => game.losing_team_player_ids.push(response._id));
                loser_2.save()
                    .then(response => game.losing_team_player_ids.push(response._id));

                return game.save();
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