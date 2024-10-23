const express = require('express');
const { User } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['firstName', 'lastName', 'email', 'username']
    });
    res.json(users);
  } catch (error) {
    console.log
    res.status(500).send(error);
  }
});


// Add a new user
router.post('/user', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: email }
        ]
      }
    });

    console.log(existingUser)

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
    }

    // Create the new user if no existing user is found
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: bcrypt.hashSync(password, 10)
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Password change endpoint
router.post('/user/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { id: userId } }); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error changing password' });
  }
});



module.exports = router;