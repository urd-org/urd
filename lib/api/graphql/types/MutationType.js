const {
  GraphQLObjectType,
} = require('graphql');

const AddPeerMutation = require('../mutations/AddPeerMutation');

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addPeer: AddPeerMutation,
  }),
});

module.exports = MutationType;
