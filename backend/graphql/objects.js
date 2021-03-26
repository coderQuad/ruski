const { GraphQLObjectType, GraphQLString, 
       GraphQLID} = require('graphql');

const HelloType = new GraphQLObjectType({
    name: 'Hello',
    fields: () => ({
        name: { type: GraphQLString }, 
        id: { type: GraphQLID }
    })
});
 
module.exports = { HelloType };