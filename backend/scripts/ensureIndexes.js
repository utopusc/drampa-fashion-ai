const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

async function ensureIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/drampa');
    
    console.log('Connected to MongoDB');

    // Drop existing indexes (except _id)
    try {
      await User.collection.dropIndexes();
      console.log('Dropped existing indexes');
    } catch (error) {
      console.log('No indexes to drop');
    }

    // Ensure indexes are created
    await User.ensureIndexes();
    console.log('Indexes ensured');

    // List all indexes
    const indexes = await User.collection.getIndexes();
    console.log('Current indexes:', indexes);

    // Check for duplicate emails
    const duplicates = await User.aggregate([
      {
        $group: {
          _id: { email: "$email" },
          count: { $sum: 1 },
          ids: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length > 0) {
      console.log('\nFound duplicate emails:');
      for (const dup of duplicates) {
        console.log(`Email: ${dup._id.email}, Count: ${dup.count}`);
        console.log('IDs:', dup.ids);
        
        // Keep the first document and remove others
        const idsToRemove = dup.ids.slice(1);
        const result = await User.deleteMany({ _id: { $in: idsToRemove } });
        console.log(`Removed ${result.deletedCount} duplicate(s) for ${dup._id.email}`);
      }
    } else {
      console.log('\nNo duplicate emails found');
    }

    console.log('\nIndex creation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

ensureIndexes();