const Stripe = require("stripe");
const CartsService = require("../services/cart.service");
const cartsService = new CartsService();

class PaymentsService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_KEY);
  }

  createPaymentIntent = async (user) => {
    try {
      const {
        amountTotal,
        filteredProductsWithStock,
        productosSinSuficienteStock,
      } = await cartsService.processCartProducts(user.cart);

      if (!filteredProductsWithStock) {
        throw new Error("Products not found");
      }

      const amountInCents = Math.round(amountTotal * 100);

      const paymentIntentInfo = {
        amount: amountInCents,
        currency: "usd",
        metadata: {
          userId: user.userId,
          description: `Payment for Cart ${user.cart}`,
          productosSinSuficienteStock: productosSinSuficienteStock.join(","),
          address: JSON.stringify(
            {
              street: "Calle de prueba",
              postalCode: "39941",
              externalNumber: "123123",
            },
            null,
            "\t"
          ),
        },
      };

      const paymentIntent = await this.stripe.paymentIntents.create(
        paymentIntentInfo
      );

      return paymentIntent;
    } catch (error) {
      throw error;
    }
  };

  async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: "pm_card_visa",
          return_url: "https://localhost:8080/home",
        }
      );
      return paymentIntent;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

module.exports = PaymentsService;
