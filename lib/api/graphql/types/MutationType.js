const {
  GraphQLObjectType,
} = require('graphql');

const SavePeerMutation = require('../mutations/SavePeerMutation');

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addPeer: SavePeerMutation,
  }),
});

module.exports = MutationType;
