import User from '../models/User.js'
import { JwtProvider } from '../providers/JwtProvider.js'
import { config } from 'dotenv'
config()

export const protectRoute = async (req, res, next) => {
  try {
    // Lấy accessToken được đính kèm từ req cookie của axios từ FE
    const accessToken = req.cookies?.accessToken

    //1. Check if the token is provided
    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized - No Token Provided' })
    }

    const accessTokenDecoded = JwtProvider.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY)
    if (!accessTokenDecoded) {
      return res.status(401).json({ message: 'Unauthorized - No Token Provided' })
    }

    //2. Check if the user exists
    const user = await User.findById(accessTokenDecoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'User not found!' })
    }

    req.user = user

    next()
  } catch (error) {
    // Check nếu accessToken hết hạn trả về lỗi 410 GONE
    if (error.message.includes('jwt expired')) {
      return res.status(410).json({ message: 'Access Token has expired!' })
    }
    res.status(401).json({ message: 'Unauthorized - Invalid Token' })
  }
}
