import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
  return jwt.sign({userId}, 'mysecret', { expiresIn: '1 hour' })
}

export default generateToken