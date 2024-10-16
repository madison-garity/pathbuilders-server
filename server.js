const cors = require('cors');
const express = require('express');
const { Message } = require('./models');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth'); // Import the auth routes

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/api', chatRoutes);
app.use('/api', authRoutes); // This will handle the forgot-password and reset-password routes

// Create a new message
app.post('/messages', async (req, res) => {
  try {
    const newMessage = await Message.create({
      text: req.body.text,
      sender: req.body.sender,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
