import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

const generateToken = (userInfo, secretKey, tokenLife) => {
  return jwt.sign(userInfo, secretKey, { algorithm: 'HS256', expiresIn: tokenLife })
}

const verifyToken = (access, secretKey) => {
  return jwt.verify(access, secretKey)
}

export const JwtProvider = { generateToken, verifyToken }
