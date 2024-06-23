import express, { response } from 'express';
import {
  Riders,
 
  getRiderAndReviews,
  getStores,
  getUserAccount,
  getUserReviews,
  gettingKitchenByLocation,
  
 
  
  userBalance,
  userLogin,
  userRegister,
  verifyOtp,
} from '../controllers/users.js';
// import { getTransactions } from '../controllers/transactionHistory.js';
// import { inserLoclToOnline } from '../controllers/migration.js';

const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post('/signin', userLogin);

userRouter.get('/riders', Riders);
userRouter.get('/find/:id', getRiderAndReviews);
userRouter.get('/reviews/:id', getUserReviews);
userRouter.get('/account/find/:userId', getUserAccount);
userRouter.get('/acct/:id', userBalance);
userRouter.get('/location', gettingKitchenByLocation);
userRouter.get('/stores', getStores);

// userRouter.post('/insert', insertFromLocalToOnline)

userRouter.post('/verification', verifyOtp);


export default userRouter;
