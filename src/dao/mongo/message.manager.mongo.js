const messageModel = require("./models/message.model");

class MessageManagerMongo {
  constructor(io) {
    this.model = messageModel;
    this.io = io;
  }

  async getMessages() {
    try {
      const messages = await this.model.find();
      return messages.map((message) => message.toObject());
    } catch (error) {
      throw error;
    }
  }

  async addMessage(user, content) {
    try {
      const newMessage = await this.model.create({
        user: user,
        content: content,
      });
      this.io.emit("new-message", {
        user: newMessage.user,
        content: newMessage.content,
        timestamp: newMessage.timestamp,
      });

      return newMessage.toObject();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MessageManagerMongo;
