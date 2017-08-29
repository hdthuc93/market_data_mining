import Item from '../models/item-model';
import InvoiceDetail from '../models/invoice_detail-model';
import { sequelize } from "../models/index-model";
import { convertToDDMMYYYY } from '../utilities/date_time_format'

function getAllItems(req, res) {
    Item.findAll()
    .then((itemResutls) => {
        let lstResults = [];
        let len = itemResutls.length;

        for(let i = 0; i < len; ++i) {
            lstResults.push({
                id: itemResutls[i]['ID'],
                name: itemResutls[i]['name'],
                price: itemResutls[i]['price'],
                size: itemResutls[i]['size'],
                color: itemResutls[i]['color'],
                createdDate: convertToDDMMYYYY(itemResutls[i]['createdDate'], '-'),
                expiredDate: convertToDDMMYYYY(itemResutls[i]['expiredDate'], '-')
            })
        }

        return res.status(200).json({
            success: true,
            message: "Get item(s) successfully",
            data: lstResults
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get item(s)"
        });
    });
}

function insertItem(req, res) {
    let reqObj = {
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        color: req.body.color,
        createdDate: new Date()
    }

    if(req.body.expiredDate) {
        let exDate = req.body.expiredDate;
        exDate = exDate.split('-');
        reqObj.expiredDate = new Date(Number(exDate[2]), Number(exDate[1] -1), Number(exDate[0]) );
        console.log(exDate, reqObj.expiredDate);
    } else
        reqObj.expiredDate = new Date();

    Item.create(reqObj)
    .then((result) => {
        if(result && result.ID) {
            return res.status(200).json({
                success: true,
                message: "Insert new item successfully"
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No record item is inserted"
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to insert item"
        });
    });
}

function updateItem(req, res) {
    let itemId = req.body.id || req.query.id;
    let reqObj = {
        name: req.body.name || req.query.name,
        price: req.body.price || req.query.price,
        size: req.body.size || req.query.size,
        color: req.body.color || req.query.color,
    }

    if(req.body.expiredDate || req.query.expiredDate) {
        let exDate = req.body.expiredDate || req.query.expiredDate;
        exDate = exDate.split('-');
        reqObj.expiredDate = new Date(Number(exDate[2]), Number(exDate[1] -1), Number(exDate[0]) );
    }

    Item.update(reqObj, { where: { ID: itemId } })
    .then((result) => {
        if(result.length === 1 && result[0] > 0) {
            return res.status(200).json({
                success: true,
                message: "Update new item successfully"
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No record item is updated"
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update item"
        });
    });
}

function getItemsBestSeller(req, res) {
    let sqlStr = `SELECT ITEM.ID AS ID,
                    ITEM.NAME AS name,
                    INVOICE_DETAIL.ID AS invoiceDetailID,
                    INVOICE_DETAIL.ITEM_ID AS itemID
                FROM ITEM AS ITEM
                    LEFT OUTER JOIN INVOICE_DETAIL AS INVOICE_DETAIL ON ITEM.ID = INVOICE_DETAIL.ITEM_ID;`;

    sequelize.query(sqlStr)
    .spread((results, metadata) => {
        let resLen = results.length;
        let mItem = new Map();
        let lstBestSeller = [], lstTemp = [];
        let maxNum;
        let objTemp;

        for(let i = 0; i < resLen; ++i) {
            // console.log(results[i].itemID);
            if(!results[i] || !results[i]["itemID"])
                continue;

            if(mItem.has(results[i].ID)) {
                objTemp = mItem.get(results[i].ID);
                objTemp.quan += 1;
                mItem.set(results[i].ID, objTemp);
            } else {
                mItem.set(results[i].ID, {
                    name: results[i].name,
                    quan: 1
                });
            }
        }

        mItem.forEach(function(value, key) {
            lstTemp.push(value);
        });

        if(lstTemp.length > 0) {
            maxNum = -1;
            let len = lstTemp.length > 10 ? 10 : lstTemp.length;

            lstTemp.sort((a, b) => {
                return b.quan - a.quan;
            })

            for(let i = 0; i < len; ++i) {
                lstBestSeller.push(lstTemp[i]);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get best seller item(s) successfully",
            data: lstBestSeller
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get best seller item(s)"
        });
    })
}

export default { getAllItems, insertItem, updateItem, getItemsBestSeller };