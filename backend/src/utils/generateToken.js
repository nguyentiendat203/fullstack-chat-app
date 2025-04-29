import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

  // Store refresh token in cookies
  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.BUILD_MODE !== 'development'
  })

  return token
}

export default generateToken
