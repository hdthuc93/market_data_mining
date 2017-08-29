import Cell from '../models/cell-model';
import Item from '../models/item-model';
import Invoice from '../models/invoice-model';
import InvoiceDetail from '../models/invoice_detail-model';

function createInvoice(req, res) {
    let lstItem = req.body.listItem;
    let itemPrice = {};
    let totalPrice = 0;
    let invoiceID, inputInvoiceDetail = [];
    let lstCellId = [];

    if(!lstItem instanceof Array || lstItem.length === 0) {
        return res.status(500).json({
            success: false,
            message: "List items do not correct insert form"
        });
    }

    Item.findAll()
    .then((results) => {
        for(let i = 0; i < results.length; ++i) {
            itemPrice[results[i].ID] = results[i].price
        }

        for(let i = 0; i < lstItem.length; ++i) {
            totalPrice += itemPrice[lstItem[i].itemID] * lstItem[i].quan;
            lstCellId.push(lstItem[i].cellId);
        }

        return Invoice.create({ totalPrice: totalPrice, createdDate: new Date() });
    })
    .then((invoice) => {
        invoiceID = invoice.ID;
        for(let i = 0; i < lstItem.length; ++i) {
            inputInvoiceDetail.push({
                invoiceID: invoiceID,
                itemID: lstItem[i].itemID,
                quantity: lstItem[i].quan,
                price: itemPrice[lstItem[i].itemID]
            });
        }

        return InvoiceDetail.bulkCreate(inputInvoiceDetail);
    })
    .then((result) => {
        return Cell.destroy({
            where: { ID: lstCellId }
        });
    })
    .then(() => {
        return res.status(200).json({
            success: true,
            message: "Insert invoice successfully"
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to insert invoice"
        });
    });
}

export default { createInvoice }