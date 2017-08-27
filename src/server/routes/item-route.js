import express from 'express';
import itemCtrl from '../controllers/item-controller';


const router = express.Router();

router.route('/')
    .get(itemCtrl.getAllItems)
    .post(itemCtrl.insertItem)
    .put(itemCtrl.updateItem)

router.route('/bestseller')
    .get(itemCtrl.getItemsBestSeller)
export default router;