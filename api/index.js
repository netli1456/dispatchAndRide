import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import reviewRouter from './routes/reviews.js';
import session from 'express-session';
import OrderRouter from './routes/orders.js';
import Flutterwave from 'flutterwave-node-v3';
import flutterRouter from './routes/flutter.js';
import transactionRouter from './routes/transactionHistory.js';

dotenv.config();
const app = express();

export const flw = new Flutterwave(
  process.env.FLUTTER_PUBLIC_KEY,
  process.env.FLUTTER_SECRET_KEY
);



app.use(express.json());
app.use(cors());
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/payment', flutterRouter);
app.use('/api/transactions', transactionRouter);

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const port = process.env.PORT;
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log('connected DB');
  })
  .catch((error) => console.log(error));
app.listen(port, () => {
  console.log('server connected @ port ' + port);
});
