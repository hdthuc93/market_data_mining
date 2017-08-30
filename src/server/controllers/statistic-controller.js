import Item from '../models/item-model';
import Invoice from '../models/invoice-model';
import InvoiceDetail from '../models/invoice_detail-model';
import { sequelize, Sequelize } from '../models/index-model';
import { convertToDDMMYYYY } from '../utilities/date_time_format';
import { FPGrowth } from '../utilities/FP_Growth';

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
        return res.status(500).json({
            success: false,
            message: "Fail to get statistic"
        });
    });
}

function calcFPGrowth(req, res) {
    let itemObj = {};
    let itemPattern = {};
    let inputFP = [];
    let temp;
    let sqlStr;
    let minSupp = 0.2, minConf = 0.4;
    
    if(req.query.minSupp && req.query.minSupp >= 0 && req.query.minSupp <= 1)
        minSupp = req.query.minSupp;

    if(req.query.minConf && req.query.minConf >= 0 && req.query.minConf <= 1)
        minConf = req.query.minConf;

    Item.findAll()
    .then((items) => {
        for(let i = 0; i < items.length; ++i) {
            itemObj[items[i].ID] = items[i].name;
            itemPattern[items[i].name] = "?";
        }

        sqlStr = `SELECT INVOICE.ID,
                        INVOICE_DETAIL.ID AS invoiceDetailID,
                        INVOICE_DETAIL.ITEM_ID AS itemID
                    FROM INVOICE AS INVOICE 
                        INNER JOIN INVOICE_DETAIL AS INVOICE_DETAIL ON INVOICE.ID = INVOICE_DETAIL.INVOICE_ID;`;

        return sequelize.query(sqlStr);
    })
    .spread((results, metadata) => {
        let len = results.length;
        let prevID;
        if(len > 0) {
            temp = Object.assign({}, itemPattern);
            prevID = results[0].ID;
            
            for(let i = 0; i < len; ++i) {
                if(prevID !== results[i].ID) {
                    inputFP.push(temp);
                    temp = Object.assign({}, itemPattern);
                    prevID = results[i].ID;
                }

                temp[itemObj[results[i].itemID]] = "y";
            }

            return FPGrowth(inputFP, minSupp, minConf);
        }
    })
    .then((results) => {
        return res.status(200).json({
            success: true,
            message: "Calculate FPGrowth successfully",
            data: results
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Fail to calculate FPGrowth"
        });
    });
}

export default { getCommonStatistic, calcFPGrowth };