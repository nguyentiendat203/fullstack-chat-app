import jwt from 'jsonwebtoken'

const generateToken = (user, res) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

  // Store refresh token in cookies
  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.BUILD_MODE !== 'development'
  })

  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    createdAt: user.createdAt
  })
}

export default generateToken
