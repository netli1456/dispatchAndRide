import express from 'express';
import {
  Riders,
 
  getRandomKitchens,
  getRiderAndReviews,
  getStores,
  getUserAccount,
  getUserReviews,
  gettingKitchenByLocation,
  userBalance,
  userLogin,
  userRegister,
} from '../controllers/users.js';
// import { getTransactions } from '../controllers/transactionHistory.js';
// import { inserLoclToOnline } from '../controllers/migration.js';

const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post('/signin', userLogin);
userRouter.get('/', getRandomKitchens);
userRouter.get('/riders', Riders);
userRouter.get('/find/:id', getRiderAndReviews);
userRouter.get('/reviews/:id', getUserReviews);
userRouter.get('/account/find/:userId', getUserAccount);
userRouter.get('/acct/:id', userBalance);
userRouter.get('/location', gettingKitchenByLocation);
userRouter.get('/stores', getStores);

// userRouter.get('/insert', inserLoclToOnline)

export default userRouter;
