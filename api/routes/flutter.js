import express from 'express';
import {
  createVirtuaAccount,
  deposited,
  initTrans,
} from '../controllers/flutter.js';

const flutterRouter = express.Router();

flutterRouter.post('/create/:id', createVirtuaAccount);
flutterRouter.post('/webhook', deposited);
flutterRouter.post('/transfer', initTrans);

export default flutterRouter;
