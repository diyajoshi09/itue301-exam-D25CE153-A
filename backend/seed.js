require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Customer.deleteMany({});
    await Restaurant.deleteMany({});
    await Order.deleteMany({});

    const customer = await Customer.create({
      name: 'Diya Joshi',
      email: 'diya.joshi@example.com',
      phone: '9876543210',
      address: 'Hostel Block B, CSPIT Campus, Changa'
    });

    const restaurants = await Restaurant.create([
      { name: 'The Italian Bistro', cuisine: 'Italian & Woodfired Pizza', rating: 4.8, isOpen: true },
      { name: 'Spice Symphony', cuisine: 'North Indian & Mughlai', rating: 4.5, isOpen: true },
      { name: 'Tokyo Express', cuisine: 'Japanese Ramen & Sushi', rating: 4.6, isOpen: false },
      { name: 'Taco Haven', cuisine: 'Mexican Street Food', rating: 4.2, isOpen: true },
      { name: 'Royal Grill & Burger', cuisine: 'American Fast Food', rating: 3.9, isOpen: false }
    ]);

    await Order.create({
      customerId: customer._id,
      restaurantId: restaurants[0]._id,
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 299 },
        { name: 'Garlic Bread', quantity: 1, price: 120 }
      ],
      totalAmount: 718,
      status: 'pending'
    });

    console.log('✅ Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
