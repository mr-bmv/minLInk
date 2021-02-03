const { Router } = require('express');
const config = require('config')
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = Router();

// endpoints

//  /api/auth/registration
router.post('/registration',
  [
    check('email', 'Wrong email').isEmail(),
    check('password', '6 symbols length required').isLength({ min: 6 }),

  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: " incorrect data for registration"
        })
      }

      const { email, password } = req.body;

      //  check is there email in db
      const candidate = await User.findOne({ email })

      if (candidate) {
        return res.status(400).json({ message: `User with ${email} already exist` })
      }

      const hashedPassword = await bcrypt.hash(password, 7)
      const user = new User({ email, password: hashedPassword })

      await user.save();
      // when this promise finished we can sent status

      res.status(201).json({ message: "User has been created" })
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" })
    }
  })

//  /api/auth/login
router.post('/login',
  [
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'Need password').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: " incorrect data for registration"
        })
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: "User not found" })
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect password" })
      }

      // create token for current user with our secret key and for 1 hour
      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )

      res.json({ token, userId: user.id })

    } catch (error) {
      res.status(500).json({ message: "Something went wrong" })
    }
  })

module.exports = router;