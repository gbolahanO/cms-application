import getUserId from '../utils/getUserId'

const User = {
  posts: {
    framgment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.Post({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      })

    }
  },
  email: {
    fragment: 'fragment userId on User { id } ',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)

      if(userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  }
}

export default User