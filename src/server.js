import { GraphQLServer } from 'graphql-yoga'
import prisma from './prisma'

const resolvers = {
  Query: {
  },
  Mutation: {
    createPost: async (_, { data }, { prisma }, info) => {
      return prisma.mutation.createPost({
        data : {
          ...data
        }
      }, info)

      // const post = await prisma.query.post()

      console.log("created")
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/generated/prisma.graphql',
  resolvers,
  context: {
    prisma
  }
})

server.start(() => console.log('Server is running on localhost:4000'))
