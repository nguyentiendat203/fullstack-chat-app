import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'
import cloudinary from '../config/cloudinary.js'

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const user = await User.findOne({ email })

    if (user) return res.status(400).json({ message: 'Email already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    if (newUser) {
      await newUser.save()

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    console.log('Error in signup controller', error.message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Email do not exist' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Password incorrect' })
    }

    generateToken(user, res)
  } catch (error) {
    console.log('Error in login controller', error.message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.log('Error in logout controller', error.message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log('Error in checkAuth controller', error.message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body

    const userId = req.user._id

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' })
    }

    // Check image size (assuming base64 string)
    const imageSizeInBytes = Buffer.from(profilePic.split(',')[1], 'base64').length
    console.log('Image size in bytes:', imageSizeInBytes)
    const maxSizeInBytes = 2 * 1024 * 1024 // 2MB

    if (imageSizeInBytes > maxSizeInBytes) {
      res.status(400).json({ message: 'Image size exceeds 2MB limit' })
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

    res.status(200).json(updatedUser)
  } catch (error) {
    console.log('error in update profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
