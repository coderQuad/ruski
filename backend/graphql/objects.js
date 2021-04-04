const { GraphQLObjectType, GraphQLString, 
       GraphQLID} = require('graphql');

const Hello = require('../models/hello');

const HelloType = new GraphQLObjectType({
    name: 'Hello',
    fields: () => ({
        name: { type: GraphQLString }, 
        tructus: { type: GraphQLString },
        id: { type: GraphQLID }
    })
});
 
module.exports = { HelloType };