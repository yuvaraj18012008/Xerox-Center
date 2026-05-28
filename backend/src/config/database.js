import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   💡 Make sure MongoDB is running on your machine.');
      console.error('   💡 You can start it with: mongod --dbpath <your-data-path>');
      console.error('   💡 Or update MONGODB_URI in .env to point to your MongoDB Atlas cluster.');
    }
    process.exit(1);
  }
};

export { connectDB };
