const { Message } = require("../model/index");
const { User } = require("../../user/model");
const UserService = require("../../user/services");
const mongoose = require("mongoose");
const { async } = require("crypto-random-string");
const ObjectId = mongoose.Types.ObjectId;

const addMessage = async (messageDetails) => {
  if (
    (typeof messageDetails.users == "string" &&
      messageDetails.users == "all") ||
    messageDetails.country
  ) {
    let query = {};
    if (messageDetails.country) {
      query.country = ObjectId(messageDetails.country);
    }
    const userIds = await UserService.getUsersOnlyIds(query);

    messageDetails.users = userIds;

    return new Message(messageDetails).save();
  }

  return new Message(messageDetails).save();
};
const getMessages = async (userId) => {
  return Message.find({ "users.user": userId });
};

const getAllMessages = async () => {
  return Message.find().sort({ created_at: -1 })
  
};

const getCountryMessages = async (country) => {
  const messages=await Message.find().sort({ created_at: -1 })
  
  await Promise.all(
    messages.map(async(message,index)=>{
      const users=await User.find({country:country})
    users.map((user)=>{
      message.users.map((m_user)=>{
      if(m_user.user==user._id){
        messages[index]={
          ...messages[index],
          country:country
        }
        
      }

      })


    })
    })
  )
  return messages;
 
  
};
const getMessageWithById = async (messageId) => {
  return Message.findById(messageId).exec();
};

const setSeenMessage = async (messageId, userId) => {
  const message = await Message.findById(messageId).exec();
  if (!message) {
    throw new Error("message not found!");
  }

  await Promise.all(
    message.users.map((u, index) => {
      if (u.user == userId) {
        message.users[index] = { user: userId, seen: true };
      }
    })
  );

  await message.save();

  return message;
};

module.exports = {
  addMessage,
  getMessages,
  getMessageWithById,
  setSeenMessage,
  getAllMessages,
  getCountryMessages,
};
