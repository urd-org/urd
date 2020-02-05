const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ping: {
      type: GraphQLString,
      resolve: () => 'pong',
    },
  }),
});

module.exports = QueryType;
