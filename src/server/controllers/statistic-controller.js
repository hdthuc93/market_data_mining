import Item from '../models/item-model';
import Invoice from '../models/invoice-model';
import { convertToDDMMYYYY } from '../utilities/date_time_format'

function getCommonStatistic(req, res) {
    let resObj = {
        numOfInvoices: 0,
        numOfDates: 0,
        numOfItems: 0
    };
    let mDate = new Set();
    let strDate;

    Invoice.findAll()
    .then((results) => {
        resObj.numOfInvoices = results.length;

        for(let i = 0; i < resObj.numOfInvoices; ++i) {
            strDate = convertToDDMMYYYY(results[i].createdDate, "-");
            mDate.add(strDate);
        }

        resObj.numOfDates = mDate.size;

        return Item.findAndCountAll();

    })
    .then((result) => {
        resObj.numOfItems = result.count;

        return res.status(200).json({
            success: true,
            message: "Get statistic successfully",
            data: resObj
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(200).json({
            success: false,
            message: "Fail to get statistic"
        });
    });
}

export default { getCommonStatistic };