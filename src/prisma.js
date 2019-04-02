import { Prisma } from "prisma-binding"
import { fragmentReplacements} from './resolvers/index'

const prisma = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: 'https://eu1.prisma.sh/gbolahan-olawuyi/cms-app/dev',
  secret: "the-things-you-shouldnt-know",
  fragmentReplacements
})

export default prisma