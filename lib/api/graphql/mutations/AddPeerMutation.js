import {
 GraphQLBoolean,
 GraphQLFloat,
 GraphQLID,
 GraphQLInt,
 GraphQLList,
 GraphQLNonNull,
 GraphQLObjectType,
 GraphQLSchema,
 GraphQLString,
} from 'graphql';

import mysql from '../../config/mysql.js';
import { fromGlobalId } from '../../utils/base64.js';

import { postType } from '../types/postType.js';

import { Post } from '../models/Post.js';

export const addLikeMutation = {
 type: postType,
 args: {
   post_id: {
     type: GraphQLID,
   },
 },
 resolve: async (request, args, context) => {
   const { id } = fromGlobalId(args.post_id);
   const post = await Post.gen(context, id);
   if (post.id) {
     await mysql.insertLike({
       post_id: post.id,
       user_id: context.user.user_id,
     });
     await Post.clear(context, post.id);
     return Post.gen(context, post.id);
   }
   return null;
 },
};
