const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@examsaathi.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@examsaathi.com',
      password: 'Admin@2026',
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@examsaathi.com');
    console.log('Password: Admin@2026');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
