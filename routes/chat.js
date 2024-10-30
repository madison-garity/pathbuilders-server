const express = require('express');
const { Chat, Message } = require('../models'); 
const router = express.Router();

// Route to get all chats
router.get('/chats/:id', async (req, res) => { 
  const { id } = req.params;
  try {
    // Fetch all chats from the database
    const chats = await Chat.findAll({
      where: { userId: id },
      order: [['updatedAt', 'DESC']], // Just sort by updatedAt
    });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Unable to fetch chats' });
  }
});

router.post('/chats-with-message', async (req, res) => {
  try {
    const { name, thread_id, userId, text } = req.body;
    
    // Create new chat
    const newChat = await Chat.create({
      name, 
      thread_id, 
      userId,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add the first message
    const newMessage = await Message.create({
      chatId: newChat.id,
      text: text,
      sender: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(200).json({
      chat: newChat,
      message: newMessage,
    });
  } catch (error) {
    console.error('Error creating new chat and message:', error);
    res.status(500).json({ error: 'Unable to create chat and message' });
  }
});


// Route to get all messages for a specific chat
router.get('/chats/:chatId/messages', async (req, res) => {
  const { chatId } = req.params;

  try {
    // Fetch all messages associated with the chat
    const messages = await Message.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']], // Sort by creation time
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Unable to fetch messages for this chat' });
  }
});

// Route to add a message to an existing chat
router.post('/chats/:chatId/messages', async (req, res) => {
  const { chatId } = req.params;
  const { text, sender } = req.body; // Expecting text and sender (either 'user' or 'assistant')

  try {
    // Create a new message in the database
    const newMessage = await Message.create({
      chatId,
      text,
      sender,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update the chat's updatedAt timestamp
    await Chat.update(
      { updatedAt: new Date() },
      { where: { id: chatId } }
    );

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Unable to add message to chat' });
  }
});

router.post('/chats/:id/favorite', async (req, res) => {
  const { id } = req.params;
  const { isFavorite } = req.body;

  try {
    // Find the chat and update its favorite status in the database
    const chat = await Chat.findOne({ where: { id: id } });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    chat.isFavorite = isFavorite;
    await chat.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating favorite status:', error);
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
});

router.delete('/chat/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the chat and delete it from the database
    const chat = await Chat.findOne({ where: { id: id } });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    await chat.destroy();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
}
);


module.exports = router;