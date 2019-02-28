import { Prisma } from "prisma-binding"

const prisma = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: 'https://eu1.prisma.sh/gbolahan-olawuyi/cms-app/dev',
  secret: "the-things-you-shouldnt-know"
})

export default prisma