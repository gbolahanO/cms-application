import getUserId from '../utils/getUserId'
const Query = {
	users(_, args, { prisma }, info) {
		const opArgs = {}

		if (args.query) {
			opArgs.where = {
				OR: [{
					name_contains: args.query
				}]
			}
		}

		return prisma.query.users(opArgs, info)
	},
	myPosts(_, args, { prisma, request }, info) {
		const userId = getUserId(request)
		const opArgs = {
			where: {
				author: {
					id: userId
				}
			}
		}

		if (args.query) {
			opArgs.where.OR = [{
				title_contains: args.query
			}, {
				body_contains: args.query
			}]
		}

		return prisma.query.posts(opArgs, info)
	},
	posts(_, args, { prisma }, info) {
		const opArgs = {
			where: {
				published: true
			}
		}

		if (args.query) {
			opArgs.where.OR = [{
				title_contains: args.query
			}, {
				body_contains: args.query
			}]
		}

		return prisma.query.posts(opArgs, info)
	},
	comments(_, args, { prisma }, info) {
		prisma.query.comments(null, info)
	},
	async me(_, args, { prisma, request }, info) {
		const userId = getUserId(request)

		return prisma.query.user({
			where: {
				id: userId
			}
		})
	},
	async post(_, args, { prisma, request }, info) {
		const userId = getUserId(request, false)

		const posts = await prisma.query.posts({
			where: {
				id: args.id,
				OR: [{
					published: true
				}, {
					author: {
						id: userId
					}
				}]
			}
		}, info)

		if (posts.length === 0) {
			throw new Error('Post not found')
		}

		return posts[0]
	}
}

export default Query;