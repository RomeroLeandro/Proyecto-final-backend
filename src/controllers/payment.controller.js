const CartsService = require("../services/cart.service");
const PaymentsService = require("../services/payment.service");
const { ObjectId } = require("mongoose").Types;
const cartsService = new CartsService();

class PaymentsController {
  constructor() {
    this.service = new PaymentsService();
  }

  async createPaymentIntent(req, res) {
    const user = req.user;
    try {
      const paymentIntent = await this.service.createPaymentIntent(user);
    } catch (error) {
      return res.sendError(500, "Internal server error", error.message);
    }
  }

  async confirmPaymentIntent(req, res) {
    const { paymentIntentId } = req.body;
    const user = req.user;

    try {
      const paymentIntent = await this.service.confirmPaymentIntent(
        paymentIntentId
      );

      const productosSinSuficienteStock =
        paymentIntent.metadata.productosSinSuficienteStock || [];

      await cartsService.finishPurchase({
        amount: paymentIntent.amount,
        user,
        productosSinSuficienteStock,
      });

      return res.sendSuccess(200, "Pago confirmado");
    } catch (error) {
      console.log(error);
      res.sendError(500, "Internal Server error", error.message);
    }
  }
}

module.exports = PaymentsController;
