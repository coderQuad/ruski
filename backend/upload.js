const mongoose = require('mongoose');
const gameModel = require('./models/game');
const playerModel = require('./models/player');
const userModel = require('./models/user');
const csv = require('csvtojson');

mongoose.connect('mongodb://127.0.0.1:27017/ruski', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

csv()
.fromFile('results.csv')
.then((csvObject) => {
    // const users = createUsers(csvObject);
    // saveUsers(users);
    createGames(csvObject).then(games => {
        for(const game of games){
            game.save()
            .catch(err => {
                console.error(err);
            });
        }
    });
}).catch(err => {
    console.log(err);
});

function saveUsers(users){
    for(const user of users){
        user.save()
        .catch(err => {
            console.error(err);
        });
    }
}

function createUsers(object){
    let users = [];
    let seen = new Set();
    for(const row of object){
        if(!seen.has(row.T1P1Name)){
            user = createUser(row.T1P1Name, users); 
            users.push(user);
            seen.add(row.T1P1Name);
        }
        if(!seen.has(row.T1P2Name)){
            user = createUser(row.T1P2Name, users);
            users.push(user);
            seen.add(row.T1P2Name);
        }
        if(!seen.has(row.T2P1Name)){
            user = createUser(row.T2P1Name, users);
            users.push(user);
            seen.add(row.T2P1Name);
        }
        if(!seen.has(row.T2P2Name)){
            user = createUser(row.T2P2Name, users);
            users.push(user);
            seen.add(row.T2P2Name);
        }

    }
    return users;
}
function createUser(username){
    return new userModel({
        handle: '',
        name: username,
        email: '',
        elo: 1500,
        friend_ids: []
    });
}
async function createGames(object){
    let games = [];

    for(const row of object){
        const t1p1 = await userModel.find({name: row.T1P1Name}, '_id').exec();
        const t1p2 = await userModel.find({name: row.T1P2Name}, '_id').exec();
        const t2p1 = await userModel.find({name: row.T2P1Name}, '_id').exec();
        const t2p2 = await userModel.find({name: row.T2P2Name}, '_id').exec();

        const t1p1_model = new playerModel({
            cups: row.T1P1Cups,
            penalties: row.T1P1Yaks,
            user_id: t1p1[0].id
        });
        t1p1_model.save();
        const t1p2_model = new playerModel({
            cups: row.T1P2Cups,
            penalties: row.T1P2Yaks,
            user_id: t1p2[0].id
        });
        t1p2_model.save();
        const t2p1_model = new playerModel({
            cups: row.T2P1Cups,
            penalties: row.T2P1Yaks,
            user_id: t2p1[0].id
        });
        t2p1_model.save();
        const t2p2_model = new playerModel({
            cups: row.T2P2Cups,
            penalties: row.T2P2Yaks,
            user_id: t2p2[0].id
        });
        t2p2_model.save();

        games.push(new gameModel({
            winning_team_player_ids: [
                t1p1_model._id,
                t1p2_model._id
            ],
            losing_team_player_ids: [
                t2p1_model._id,
                t2p2_model._id
            ],
            location: '',
            description: '',
            comment_ids: [],
            likes: 0
        }));
    }
    return games;
}