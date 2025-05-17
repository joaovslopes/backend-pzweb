// src/routes/payments.js
const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order'); // Seu modelo MongoDB

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

// Rota para criar pagamento com Mercado Pago
router.post('/create-mercadopago-payment', async (req, res) => {
  try {
    const { productId, productName, price, email, description } = req.body;
    
    // Detecta se é PIX ou cartão
    const paymentMethod = req.body.paymentMethod || 'creditCard';
    
    let paymentData = {
      transaction_amount: Number(price),
      description: description,
      payment_method_id: paymentMethod,
      payer: {
        email: email
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/success`,
        failure: `${process.env.FRONTEND_URL}/failure`,
        pending: `${process.env.FRONTEND_URL}/pending`
      },
      auto_return: 'approved'
    };
    
    // Adicione configuração específica para PIX se necessário
    if (paymentMethod === 'pix') {
      paymentData.payment_method_id = 'pix';
      // Pode adicionar mais configurações específicas do PIX aqui
    }
    
    const payment = await mercadopago.payment.create(paymentData);
    
    // Salvar o pedido no MongoDB
    const order = new Order({
      productId,
      productName,
      price,
      email,
      paymentMethod: 'mercadopago',
      paymentId: payment.body.id,
      status: 'pending'
    });
    
    await order.save();
    
    return res.status(200).json({
      id: payment.body.id,
      init_point: payment.body.init_point,
      orderId: order._id
    });
    
  } catch (error) {
    console.error('Erro ao criar pagamento Mercado Pago:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Rota para criar pagamento com Stripe
router.post('/create-stripe-payment', async (req, res) => {
  try {
    const { productId, productName, price, email, description } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // ou a moeda apropriada
            product_data: {
              name: productName,
              description: description,
            },
            unit_amount: Math.round(price * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: email,
    });
    
    // Salvar o pedido no MongoDB
    const order = new Order({
      productId,
      productName,
      price,
      email,
      paymentMethod: 'stripe',
      paymentId: session.id,
      status: 'pending'
    });
    
    await order.save();
    
    return res.status(200).json({
      id: session.id,
      url: session.url,
      orderId: order._id
    });
    
  } catch (error) {
    console.error('Erro ao criar pagamento Stripe:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Webhook para receber notificações do Mercado Pago
router.post('/mercadopago-webhook', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (data.id) {
      const paymentInfo = await mercadopago.payment.findById(data.id);
      const payment = paymentInfo.body;
      
      // Atualizar status do pedido no MongoDB
      if (payment) {
        await Order.findOneAndUpdate(
          { paymentId: payment.id },
          { status: payment.status }
        );
      }
    }
    
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook do Mercado Pago:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Webhook para receber notificações do Stripe
router.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Atualizar status do pedido no MongoDB
      await Order.findOneAndUpdate(
        { paymentId: session.id },
        { status: 'approved' }
      );
      
      // Aqui você pode adicionar lógica para entregar o produto
    }
    
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook do Stripe:', error);
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;