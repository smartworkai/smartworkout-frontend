const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const db = require('../utils/db')

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'refresh',
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1', [email]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()

    await db.query(
      `INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [userId, email, hashedPassword, name || email.split('@')[0]]
    )

    try {
      await db.query(
        `INSERT INTO profiles (id, user_id, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())`,
        [uuidv4(), userId]
      )
    } catch(e) {}

    try {
      await db.query(
        `INSERT INTO subscriptions (id, user_id, plan, status, created_at, updated_at)
         VALUES ($1, $2, 'free', 'active', NOW(), NOW())`,
        [uuidv4(), userId]
      )
    } catch(e) {}

    const { accessToken, refreshToken } = generateTokens(userId)

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: userId, email, name: name || email.split('@')[0] }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Could not create account' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = result.rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const { accessToken, refreshToken } = generateTokens(user.id)

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Could not log in' })
  }
})

// GET CURRENT USER
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const result = await db.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [decoded.userId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ user: result.rows[0] })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// LOGOUT
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' })
})

module.exports = router
