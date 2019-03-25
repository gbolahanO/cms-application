const Mutation = {
	async createUser(_, args, { prisma }, info) {
		const emailTaken = await prisma.exists.User({ email: args.data.email })

		if (emailTaken) {
			throw new Error('Email taken')
		}

		const user = await prisma.mutation.createUser({ data: args.data }, info)

		return user
	},

	async deleteUser(_, args, { prisma }, info) {
		const userExits = await prisma.exists.User({ id: args.where.id})

		if (!userExits) {
			throw new Error('User not found')
		} else {
			console.log(userExits)
		}

		// return prisma.mutation.deleteUser({
		// 	where: {
		// 		id: args.where.id
		// 	}
		// }, info)
	}
}

export default Mutation