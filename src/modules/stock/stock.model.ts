import mongoose from 'mongoose';
import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
import { IStockDoc, IStockModel } from './stock.interfaces';
import { Product } from '../product';

const stockSchema = new mongoose.Schema<IStockDoc, IStockModel>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

stockSchema.post('save', async function (doc: IStockDoc, next) {
  try {
    const product = await Product.findById(doc.productId);
    if (product) {
      product.set({ stock: doc.id });
      await product.save();
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// add plugin that converts mongoose to json
stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);

const Stock = mongoose.model<IStockDoc, IStockModel>('Stock', stockSchema);

export default Stock;
