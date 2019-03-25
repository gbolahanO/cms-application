const Query = {
	users(_, args, { prisma }, info) {
		const opArgs = {}

		if (args.query) {
			opArgs.where = {
				OR: [{
					name_contains: args.query
				}, {
					email_contains: args.query
				}]
			}
		}

		return prisma.query.users(opArgs, info)
	},
	posts(_, args, { prisma }, info) {
		const opArgs = {}

		if (args.query) {
			opArgs.where = {
				OR: [{
					title_contains: args.query
				}, {
					body_contains: args.query
				}]
			}
		}

		return prisma.query.posts(opArgs, info)
	},
	comments(_, args, { prisma }, info) {
		prisma.query.comments(null, info)
	}
}

export default Query;