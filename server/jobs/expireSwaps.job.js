const cron = require('node-cron');
const Swap = require('../models/Swap');

const expireSwaps = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const expiredSwaps = await Swap.updateMany(
        {
          status: 'pending',
          expiresAt: { $lt: now }
        },
        {
          status: 'cancelled',
          updatedAt: now
        }
      );
      console.log(`Expired ${expiredSwaps.modifiedCount} swaps.`);
    } catch (error) {
      console.error('Error in expireSwaps job:', error);
    }
  });
};

module.exports = expireSwaps;
