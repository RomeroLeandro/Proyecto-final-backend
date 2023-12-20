const ticketModel = require("./models/ticket.model");
const { v4: uuidv4 } = require("uuid");

class TicketManagerMongo {
  constructor() {
    this.model = ticketModel;
  }
  async getTicketById(id) {
    try {
      const ticket = await ticketModel.findOne({ _id: id });
      if (!ticket) {
        throw new Error(`Ticket ${id} not found`);
      }
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async createTicket(ticket) {
    try {
      const newTicket = await ticketModel.create({
        code: uuidv4(),
        amount: ticket.amount,
        purchaser: ticket.purchaser,
      });
      return newTicket;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TicketManagerMongo;
