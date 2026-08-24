const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'customerId reference is required']
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'restaurantId reference is required']
    },
    items: {
      type: [
        {
          name: { type: String, required: [true, 'Item name is required'] },
          quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
          price: { type: Number, required: true, min: [0, 'Price cannot be negative'] }
        }
      ],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Order must contain at least one item'
      }
    },
    totalAmount: {
      type: Number,
      required: [true, 'totalAmount is required'],
      min: [0, 'totalAmount must be greater than or equal to 0']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status'
      },
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
