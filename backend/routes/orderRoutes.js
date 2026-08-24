const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/v1/orders (Protected) - Returns 201
router.post('/', async (req, res, next) => {
  try {
    const { customerId, restaurantId, items, totalAmount, status } = req.body;
    const finalCustomerId = customerId || req.user.id;

    const newOrder = new Order({
      customerId: finalCustomerId,
      restaurantId,
      items,
      totalAmount,
      status: status || 'pending'
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/orders (Protected) - Populated with Customer and Restaurant
router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/orders/:id/status (Protected)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name cuisine');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
