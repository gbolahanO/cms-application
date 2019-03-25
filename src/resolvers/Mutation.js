import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
	async createUser(_, args, { prisma }, info) {

		if (args.data.password.length < 8) {
			throw new Error('password must be 8 characters')
		}

		const password = await bcrypt.hash(args.data.password, 10)	

		const user = prisma.mutation.createUser({ 
			data: {
				...args.data,
				password
			}
		})

		return {
			user,
			token: jwt.sign({userId: user.id}, 'mysecret')
		}

	},
	async deleteUser(_, args, { prisma }, info) {
		const userExits = await prisma.exists.User({ id: args.where.id})

		if (!userExits) {
			throw new Error('User not found')
		}

		return prisma.mutation.deleteUser({
			where: {
				id: args.id
			}
		}, info)
	},
	async updateUser(_, args, { prisma }, info) {
		return prisma.mutation.updateUser({
			where: {
				id: args.id
			},
			data: args.data
		}, info)
	},
	async createPost(_, args, { prisma }, info) {
		return prisma.mutation.createPost({
			data: {
				title: args.data.title,
				body: args.data.body,
				author: {
					connect: {
						id: args.data.author
					}
				}
			}
		}, info)
	},
	async deletePost(_, args, { prisma }, info) {
		return prisma.mutation.deletePost({
			where: {
				id: args.id
			}
		}, info)
	},
	async updatePost(_, args, { prisma }, info) {
		return prisma.mutation.updatePost({
			where: {
				id: args.id
			},
			data: args.data
		}, info)
	},
	async createComment(_, args, { prisma }, info) {
		return prisma.mutation.createComment({
			data: {
				text: args.data.text,
				author: {
					connect: {
						id: args.data.author
					}
				},
				post: {
					connect: {
						id: args.data.post
					}
				}
			}
		}, info)
	},
	async updateComment(_, args, { prisma }, info) {
		return prisma.mutation.updateComment({
			where: {
				id: args.id
			},
			data: args.data
		}, info)
	},
	async deleteComment(_, args, { prisma }, info) {
		return prisma.mutation.deleteComment({
			where: {
				id: args.id
			}
		}, info)
	}
}

export default Mutation