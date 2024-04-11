import TransactionHistory from '../models/TransactionHistory.js';
import User from '../models/User.js';

export const getTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const history = []
    if (!user) {
      res.status(404).json({ message: 'you are not a registered user' });
    }
    const transactions = await TransactionHistory.find({
      $or: [{ buyerId: id }, { businessId: id }],
    }).sort({ createdAt: -1 });

    for (const transaction of transactions) {
      const buyer = await User.findById(transaction.buyerId);
      const business = await User.findById(transaction.businessId);

      const details = {
        buyerId: transaction.buyerId,
        businessId: transaction.businessId,
        amount: transaction.amount,
        status: transaction.status,
        orderId: transaction.orderId,
        createdAt: transaction.createdAt,
        buyerName: buyer.name,
        businessName: business.name,
      };
      history.push(details)
    }

    if (history.length !== 0) {
      return res.status(200).json(history);
    } else {
      return res.status(404).json({ message: 'nothing to show' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
