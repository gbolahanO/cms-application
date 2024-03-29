import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
	async createUser(_, args, { prisma }, info) {
		const password = await hashPassword(args.data.password)
		const user = prisma.mutation.createUser({
			data: {
				...args.data,
				password
			}
		})

		return {
			user,
			token: generateToken(user.id)
		}

	},
	async login(_, args, { prisma }, info) {
		const user = await prisma.query.user({
			where: {
				email: args.data.email
			}
		})

		if (!user) {
			throw new Error('Unable to login')
		}

		const isMatch = await bcrypt.compare(args.data.password, user.password)

		if (!isMatch) {
			throw new Error('Unable to login')
		}

		return {
			user,
			token: generateToken(user.id)
		}
	},
	async deleteUser(_, args, { prisma, request}, info) {
		const userId = getUserId(request)

		return prisma.mutation.deleteUser({
			where: {
				id: userId
			}
		}, info)
	},
	async updateUser(_, args, { prisma, request }, info) {
		const userId = getUserId(request)

		if (typeof args.data.password === 'string') {
			args.data.password = await hashPassword(args.data.password)
		}
		return prisma.mutation.updateUser({
			where: {
				id: userId
			},
			data: args.data
		}, info)
	},
	async createPost(_, args, { prisma, request }, info) {
		const userId = getUserId(request)

		return prisma.mutation.createPost({
			data: {
				title: args.data.title,
				body: args.data.body,
				published: args.data.published,
				author: {
					connect: {
						id: userId
					}
				}
			}
		}, info)
	},
	async deletePost(_, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const postExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId
			}
		})

		if (!postExists) {
			throw new Error("Unable to delete post")
		}

		return prisma.mutation.deletePost({
			where: {
				id: args.id
			}
		}, info)
	},
	async updatePost(_, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const postExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId
			}
		})

		const isPublished = await prisma.exists.Post({ id: args.id, published: true})

		if (isPublished && args.data.published === false) {
			await prisma.mutation.deleteManyComments({ where: {post: { id: args.id }}})
		}

		if (!postExists) {
			throw new Error("Unable to update post")
		}

		return prisma.mutation.updatePost({
			where: {
				id: args.id
			},
			data: args.data
		}, info)
	},
	async createComment(_, args, { prisma, request }, info) {
		const userId = getUserId(request)
		const postExists = await prisma.exists.Post({
			id: arg.data.post,
			published: true
		})

		if (!postExists) {
			throw new Error("Unable to find post")
		}

		return prisma.mutation.createComment({
			data: {
				text: args.data.text,
				author: {
					connect: {
						id: userId
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
	async updateComment(_, args, { prisma, request }, info) {
		const userId = getUserId(request)
		const commentExists = await prisma.exists.Comment({
			id: args.id,
			author: {
				id: userId
			}
		})

		if (!commentExists) {
			throw new Error("Unable to delete comment")
		}

		return prisma.mutation.updateComment({
			where: {
				id: args.id
			},
			data: args.data
		}, info)
	},
	async deleteComment(_, args, { prisma, request }, info) {
		const userId = getUserId(request)
		const commentExists = await prisma.exists.Comment({
			id: args.id,
			author: {
				id: userId
			}
		})

		if (!commentExists) {
			throw new Error("Unable to update comment")
		}

		return prisma.mutation.deleteComment({
			where: {
				id: args.id
			}
		}, info)
	}
}

export default Mutation