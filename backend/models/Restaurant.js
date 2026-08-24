const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine type is required'],
      trim: true
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
