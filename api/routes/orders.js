import express from 'express';
import {
  CreateOrder,
  getSingleOrder,
  orderedItems,
  refundAndCancelOrder,
  takeOrder,
} from '../controllers/orders.js';

const OrderRouter = express.Router();

OrderRouter.post('/:buyerId/:businessId', CreateOrder);
OrderRouter.get('/allorders/:id', orderedItems);
OrderRouter.get('/find/:id/:orderId', getSingleOrder);
OrderRouter.put('/takeorder/:businessId/:orderId', takeOrder);
OrderRouter.put('/refund/:id/:orderId', refundAndCancelOrder);
// OrderRouter.get('/test/:id', searchOrder)

export default OrderRouter;
