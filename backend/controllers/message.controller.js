import { getConnectedUsers, getIO } from '../socket/socket.server.js';
import { Message } from '../models/message.model.js';

export const sendMessage = async (req, res) => {
  const { _id } = req.user;
  try {
    const { content, receiverId } = req.body;
    const newMessage = new Message({
      sender: _id,
      receiver: receiverId,
      content: content,
    });
    await newMessage.save();

    //TODO send the message using socket.io -> DONE
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const receiverSocketId = connectedUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', {
        message: newMessage,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message Sent',
      data: { newMessage },
    });
  } catch (error) {
    console.log('Error in sendMessage controller', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getConversation = async (req, res) => {
  const { _id } = req.user;
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: _id, receiver: userId },
        { sender: userId, receiver: _id },
      ],
    }).sort('createdAt');
    res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.log('Error on getConversation controller', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
