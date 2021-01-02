const MessageService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const addMessage = async (req, res) => {
  const [message_err, message] = await promiseHandler(
    MessageService.addMessage(req.body)
  );
  if (message_err) {
    return res.json({ status: false, message: message_err });
  }

  return res.json({ status: true, message });
};

const getMessages = async (req, res) => {
  const { userId } = req.params;
  const [messages_err, messages] = await promiseHandler(
    MessageService.getMessages(userId)
  );
  if (messages_err) {
    return res.json({ status: false, message: messages_err });
  }

  return res.json({ status: true, messages });
};

module.exports = {
  addMessage,
  getMessages,
};
