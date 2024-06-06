import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Account from '../models/accounts.js';
import { sanitizeKitchen } from '../middleWare/MiddleWare.js';

export const userRegister = async (req, res) => {
  const saltRounds = 10;
  try {
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User({ ...req.body, password: hash });
    await user.save();
    const token = jwt.sign(
      {
        _id: user._id,
        surname: user.surname,
        email: user.email,
        firstname: user.firstname,
      },
      process.env.JWT_SECRET
    );
    const { password, ...others } = user._doc;
    res.status(200).json({ user: others, token });
  } catch (error) {
    res.status(500).json({ message: 'fill the neccessary fields' });
  }
};

export const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.password) {
      const isCorrect = bcrypt.compareSync(req.body.password, user.password);
      if (!isCorrect)
        return res.status(401).json({ message: 'wrong credentials' });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
      },
      process.env.JWT_SECRET
    );
    const { password, ...others } = user._doc;
    res.status(200).json({ user: others, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// kitchen and search

// export const randomKitchens = async (req, res) => {
//   const fetchKitchens = new Set();
//   const kitchens = [];
//   try {
//     const { query, page = 1, pageSize = 10 } = req.query;

//     const skip = (page - 1) * pageSize;

//     let aggregationPipeline = [];

//     if (query !== 'all') {
//       aggregationPipeline.push({
//         $match: {
//           $or: [
//             { desc: { $regex: query, $options: 'i' } },
//             { category: { $regex: query, $options: 'i' } },
//             { type: { $regex: query, $options: 'i' } },
//             { name: { $regex: query, $options: 'i' } },
//           ],
//         },
//       });
//     } else {
//       {
//       }
//     }
//     aggregationPipeline.push({
//       $match: { userId: { $nin: Array.from(fetchKitchens) } },
//     });

//     aggregationPipeline.push({ $sample: { size: parseInt(pageSize) } });

//     const products = await Product.aggregate(aggregationPipeline);
//     if (products) {
//       for (const product of products) {
//         if (!fetchKitchens.has(product.userId)) {
//           const kitchen = await User.findById(product.userId);
//           if (kitchen) {
//             const allKitchens = {
//               rating: kitchen.rating,
//               verified: kitchen.verified,
//               physicalAddress: kitchen.physicalAddress,
//               businessName: kitchen.businessName,
//               businessImg: kitchen.businessImg,
//               deliveryRate: kitchen.deliveryRate,
//               km: kitchen.km,
//               _id: kitchen._id,
//               timeOpen: kitchen.timeOpen,
//             };
//             kitchens.push(allKitchens);
//             fetchKitchens.add(product.userId);
//           } else {
//             return res.status(404).json({ message: 'no available kitchens' });
//           }
//         }
//       }
//     }
//     res.status(200).json(kitchens);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getRandomKitchens = async (req, res) => {
  try {
    const { query, page = 1, pageSize = 10 } = req.query;
    const aggregationPipeline = [];
    aggregationPipeline.push(
      {
        $match: {
          $or: [
            { desc: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } },
          ],
        },
      },
      { $sample: { size: parseInt(pageSize) } },
    );
    const itemsToSkip = (page - 1) * pageSize;
    aggregationPipeline.push({ $skip: itemsToSkip });

    const kitchens =
      query !== 'all'
        ? await Product.aggregate(aggregationPipeline)
        : await Product.find()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));
    const uniqueKitchenIds = new Set(kitchens.map((kitchen) => kitchen.userId));
    const uniqueKitchens = await User.find({
      _id: { $in: Array.from(uniqueKitchenIds) },
    });

    res
      .status(200)
      .json(uniqueKitchens.map((kitchen) => sanitizeKitchen(kitchen)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Riders = async (req, res) => {
  try {
    const { query, page = 1, pageSize = 10 } = req.query;
    const fetchRiders = new Set();

    const aggregationPipeline = [];

    aggregationPipeline.push({
      $match: { isDispatcher: true, _id: { $nin: Array.from(fetchRiders) } },
    });

    aggregationPipeline.push({ $sample: { size: parseInt(pageSize) } });

    if (query) {
      aggregationPipeline.push({
        $match: {
          $or: [{ physicalAddress: { $regex: query, $options: 'i' } }],
        },
      });
    }
    const riders = await User.aggregate(aggregationPipeline);

    res.status(200).json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRiderAndReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = [];

    const user = await User.findById(id);
    if (user) {
      const review = await Review.find({ userId: id });
      if (!review) {
        return res.status(500).json({ message: 'no reviews' });
      }
      for (const reviewws of review) {
        const reviewerData = await User.findById(reviewws.reviewerId);
        const reviewss = {
          reviewerName: reviewerData.name,
          reviewerImg: reviewerData.img,
          msg: reviewws.msg,
          reviewerId: reviewws.reviewerId,
          _id: reviewws._id,
          positive: reviewws.positive,
        };
        reviews.push(reviewss);
      }

      const userData = {
        name: user.name,
        km: user.km,
        deliveryRate: user.deliveryRate,
        rating: user.rating,
        balance:
          user?._id.toString() === id && user.isDispatcher ? user.balance : '',
      };

      const positiveReviews = reviews
        .filter((review) => review.positive === false)
        .slice(0, 2);
      const negativeReviews = reviews
        .filter((review) => review.positive === true)
        .slice(0, 2);

      const allReviews = [...positiveReviews, ...negativeReviews];

      return res.status(200).json({ allReviews, user: userData });
    } else {
      return res.status(404).json({ message: 'no user available' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = [];
    console.log('reviews', reviews);

    const review = await Review.find({ userId: id });

    if (!review) {
      return res.status(500).json({ message: 'no reviews' });
    }
    if (review.length > 0) {
      for (const reviewws of review) {
        const reviewerData = await User.findById(reviewws.reviewerId);
        const reviewss = {
          reviewerName: reviewerData.name,
          reviewerImg: reviewerData.img,
          msg: reviewws.msg,
          reviewerId: reviewws.reviewerId,
          _id: reviewws._id,
          positive: reviewws.positive,
        };
        reviews.push(reviewss);
      }

      const positiveReviews = reviews
        .filter((rev) => rev.positive === true)
        .slice(0, 2);

      const negativeReviews = reviews
        .filter((rev) => rev.positive === false)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 1);

      const allReviews = [...positiveReviews, ...negativeReviews];

      return res.status(200).json(allReviews);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const account = await Account.findOne({ userId: userId });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res
      .status(200)
      .json({ bank: account.bank, accountNumber: account.accountNumber });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const userBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'something went wrong' });
    }

    res.status(200).json(user.balance.toFixed(2));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const insertFromLocalToOnline = async (req, res) => {
  try {
    const local = await User.find();
    const online = await User.insertMany({ local });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
