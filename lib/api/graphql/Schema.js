const {
  GraphQLSchema,
} = require('graphql');

const QueryType = require('./types/QueryType');
const MutationType = require('./types/MutationType');

const Schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

module.exports = Schema;
