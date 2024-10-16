const express = require('express');
const { Chat } = require('../models'); 
const router = express.Router();


// Route to get all chats
router.get('/chats', async (req, res) => {
  try {
    // Fetch all chats from the database
    const chats = await Chat.findAll();
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch chats' });
  }
});

module.exports = router;
