const {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql');

const QueryType = require('./types/QueryType');

const Schema = new GraphQLSchema({
  query: QueryType,
  // mutation: mutationType,
});

module.exports = Schema;
