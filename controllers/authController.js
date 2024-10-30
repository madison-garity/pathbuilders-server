const { Op } = require('sequelize'); // Import Sequelize Operators
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Sequelize User model

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = '461636dcd2955c2867b0003f0ff3a43c4978b515f0b5c9aa7cf752fbd3cbdb70'; // Secret key for JWT

// Generate and send password reset token
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');

    // Set reset token and expiration on user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    // Send email with the token
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'pathbuilder.help@gmail.com',
        pass: 'gnhn abkf vznl apek',
      },
    });

    const mailOptions = {
      to: user.email,
      from: 'mdgarity@gmail.com',
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of your password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
      http://localhost:3000/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Login function
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send the token as a response
    res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find the user by reset token and check expiration
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }, // Token is still valid
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Time Expired' });
    }

    // Hash the new password and save it
    const saltRounds = 10;
    user.password = await bcrypt.hash(password, saltRounds);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: 'Password has been updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login, forgotPassword, resetPassword };
