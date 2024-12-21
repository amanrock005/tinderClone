import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    //real time messaging using socket.io
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const receiverSocketId = connectedUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        message: newMessage,
      });
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (err) {
    console.error("error in send message controller ", err);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;

  try {
    const message = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort("createdAt");

    res.status(200).json({
      success: true,
      message,
    });
  } catch (err) {
    console.log("error in get conversation ", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
