const expressAsyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400);
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    // Populate sender field in the message document
    const populatedMessage = await newMessage.populate("sender", "name");

    // Populate chat field in the message document
    await populatedMessage.populate("chat");

    // Populate users field in the chat document
    await User.populate(populatedMessage, {
      path: "chat.users",
      select: "name email",
    });

    // Update latestMessage field in the chat document
    await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedMessage });

    res.json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(400).send(error.message);
  }
});

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = { sendMessage, allMessages };
