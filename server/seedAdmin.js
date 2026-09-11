const mongoose = require('mongoose');
const User = require('./src/models/User'); // Adjust path to your User model
const dotenv = require('dotenv');

dotenv.config();

const adminData = {
  email: 'admin@nits.ac.in',
  password: 'admin@1234',
  name: 'Admin',
  college: 'NIT Silchar',
  phone: '0000000000',
  role: 'admin'
};

const seedAdmin = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // 2. Check if admin already exists
    const adminExists = await User.findOne({ email: adminData.email });

    if (adminExists) {
      console.log('Admin user already exists.');
    } else {
      // 3. Create the new admin user
      // The 'pre-save' hook in your User.js model will
      // automatically hash the password.
      await User.create(adminData);
      console.log('Admin user created successfully!');
    }

  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  } finally {
    // 4. Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedAdmin();