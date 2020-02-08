const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

const PeerType = new GraphQLObjectType({
  name: 'Peer',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (peer) => peer.id,
    },
    address: {
      type: GraphQLString,
      resolve: (peer) => peer.getAddress(),
    },
    outbound: {
      type: GraphQLBoolean,
      resolve: (peer) => peer.outbound,
    },
    version: {
      type: GraphQLString,
      resolve: (peer) => peer.version,
    },
    height: {
      type: GraphQLInt,
      resolve: (peer) => peer.height,
    },
    syncing: {
      type: GraphQLBoolean,
      resolve: (peer) => peer.syncing,
    },
  }),
});

module.exports = PeerType;
