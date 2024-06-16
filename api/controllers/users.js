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
    const userDetails = {
      firstname: user.firstname,
      _id: user._id,
    };
    res.status(200).json({ user: userDetails, token });
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
    const userDetails = {
      firstname: user.firstname,
      _id: user._id,
    };
   
    res.status(200).json({ user: userDetails, token });
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
};

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
      { $sample: { size: parseInt(pageSize) } }
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

export const gettingKitchenByLocation = async (req, res) => {
  try {
    const { query } = req.query;

    if (query) {
      const RegisteredKitchens = await User.exists({
        $or: [
          { physicalAddress: { $regex: query, $options: 'i' } },
          { state: { $regex: query, $options: 'i' } },
          { lga: { $regex: query, $options: 'i' } },
          { placesCanDeliverTo: { $regex: query, $options: 'i' } },
        ],
      });

      RegisteredKitchens
        ? res.status(200).json('store exist')
        : res
            .status(200)
            .json('Sorry, we do not have stores in this location yet');
    } else {
      res.status(200).json('query is required');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const {
      query = '',
      rating,
      popularFilter,
      page,
      pageSize = 16,
      searchedLocation,
    } = req.query;

    const ratingNumber = rating ? parseFloat(rating) : null;

    const searchConditions = {
      isBusinessOwner: true,
      blocked: false,
      suspended: false,
    };

    // const stores = await User.find({
    //   isBusinessOwner: true,
    //   blocked: false,
    //   suspended: false,
    //   $or: [
    //     { physicalAddress: { $regex: query, $options: 'i' } },
    //     { lga: { $regex: query, $options: 'i' } },
    //     { state: { $regex: query, $options: 'i' } },
    //     { placesCanDeliverTo: { $regex: query, $options: 'i' } },
    //   ],
    // });

    if (searchedLocation) {
      searchConditions.$or = [
        { lga: { $regex: searchedLocation, $options: 'i' } },
        { state: { $regex: searchedLocation, $options: 'i' } },
        { country: { $regex: searchedLocation, $options: 'i' } },
        { physicalAddress: { $regex: searchedLocation, $options: 'i' } },
      ];
    }
    if (query) {
      searchConditions.$or = [
        { businessName: { $regex: query, $options: 'i' } },
      ];
    }

    const stores = await User.find(searchConditions);

    if (!stores) return;

    let filteredStores = stores.map((store) => ({
      businessName: store.businessName,
      _id: store._id,
      businessImg: store.businessImg,
      verified: store.verified,
      rating: store.rating,
      km: store.km,
      deliveryRate: store.deliveryRate,
      physicalAddress: store.physicalAddress,
      timeOpen: store.timeOpen,
    }));

    if (ratingNumber !== null && searchedLocation) {
      searchConditions.$or[
        ({ physicalAddress: { $regex: searchedLocation, $options: 'i' } },
        { lga: { $regex: searchedLocation, $options: 'i' } },
        { state: { $regex: searchedLocation, $options: 'i' } },
        { country: { $regex: searchedLocation, $options: 'i' } })
      ],
        filteredStores.sort((a, b) => b.rating - a.rating);
    }

    if (popularFilter) {
      const storesWithPopularProducts = [];
      const noduplicateId = new Set();

      for (const store of stores) {
        const products = await Product.find({
          userId: store._id.toString(),
          $or: [
            { type: { $regex: popularFilter, $options: 'i' } },
            { category: { $regex: popularFilter, $options: 'i' } },
            { name: { $regex: popularFilter, $options: 'i' } },
            { desc: { $regex: popularFilter, $options: 'i' } },
          ],
        });

        if (products.length > 0) {
          const productsUserId = products.map((product) => product.userId);
          if (store._id.toString() === productsUserId.toString()) {
            storesWithPopularProducts.push(store);
            noduplicateId.add(store._id.toString());
          }
        }
      }
      filteredStores = storesWithPopularProducts;
    }

    const startIndex = (page - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);

    const paginatedStores = filteredStores.slice(startIndex, endIndex);

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    shuffleArray(paginatedStores);

    res.status(200).json(paginatedStores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// export const createusers = async (req, res) => {
//   const saltRounds = 10;

//   try {
//     const hash = bcrypt.hashSync(req.body.password, saltRounds);
//     const user = new User({ ...req.body, password: hash });
//     await user.save();

//     if (user.phone) {
//       const message = await client.messages.create({
//         body: 'Your confirmation code: 097473',
//         from: '+1234567890', // Your Twilio phone number
//         to: user.phone, // User's phone number from req.body
//       });

//       console.log('SMS sent. SID:', message.sid);

//       // Respond with success message after sending email
//       res.status(200).json({ message: 'User created successfully', info});
//     } else {
//       res.status(400).json({ message: 'User email not provided' });
//     }
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ message: 'Failed to create user' });
//   }
// };
