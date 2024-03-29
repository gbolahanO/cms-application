import jwt from 'jsonwebtoken'
const getUserId = (request, requireAuth = true) => {
	const header = request.request.headers.authorization

	if (header) {
		const token = header.replace('Bearer ', '')
		const decoded = jwt.verify(token, 'mysecret')

		return decoded.userId
	}

	if (requireAuth) {
		throw new Error("Authentication required")
	}

	return null
	
}

export default getUserId