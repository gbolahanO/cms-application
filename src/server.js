import { GraphQLServer } from 'graphql-yoga'
import prisma from './prisma'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'

const resolvers = {
  Query,
  Mutation
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    prisma
  }
})

server.start(() => console.log('Server is running on localhost:4000'))
