export const protectRoute = (req, res, next) => {
  const token = req.headers.authorization
  if (token === 'mock-token') {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
