import Item from '../models/item-model';
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

export default { getAllItems };