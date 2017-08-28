import { sequelize } from "../models/index-model";

function getInfo(req, res) {
    let queryString = `Select a.ID as AREA_ID,
                                    a.NAME as AREA_NAME,
                                    a.NUM_OF_ROWS as NUM_ROWS,
                                    a.NUM_OF_COLS as NUM_COLS,
                                    a.NUM_OF_SHELVES as NUM_SHELVES,
                                    a.X_AXIS as X_AXIS,
                                    a.Y_AXIS as Y_AXIS,
                                    a.RADIAN as RADIAN,
                                    i.ID as ITEM_ID,
                                    i.NAME as ITEM_NAME,
                                    i.PRICE as PRICE,
                                    i.SIZE as SIZE,
                                    i.COLOR as COLOR,
                                    c.ID as CELL_ID,
                                    c.ROW_INDEX as ROW_INDEX,
                                    c.COL_INDEX as COL_INDEX
                        From  AREA as a 
                                    LEFT JOIN CELL as c ON a.ID = c.AREA_ID
                                    LEFT JOIN ITEM as i ON i.ID = c.ITEM_ID;`;

    let lst = [];
    sequelize.query(queryString)
    .spread((results, metadata) => {
        let mapIndex = new Map();
        let len = results.length;
        let index = 0;
        for(let i = 0; i < len; ++i) {
            if(!mapIndex.has(results[i]["AREA_ID"])) {
                mapIndex.set(results[i]["AREA_ID"], index);
                lst[index] = {};
                ++index;
            }

            let j = mapIndex.get(results[i]["AREA_ID"]);

            if(!lst[j].hasOwnProperty("id")) {
                lst[j].id = results[i]["AREA_ID"];
                lst[j].name = results[i]["AREA_NAME"];
                lst[j].row = results[i]["NUM_ROWS"];
                lst[j].col = results[i]["NUM_COLS"];
                lst[j].shelves = results[i]["NUM_SHELVES"];
                lst[j].x_axis = results[i]["X_AXIS"];
                lst[j].y_axis = results[i]["Y_AXIS"];
                lst[j].radian = results[i]["RADIAN"];
            }

            if(!lst[j].items)
                lst[j].items = [];
            
            if(results[i]["ITEM_ID"]) {
                lst[j].items.push({
                    id: results[i]["ITEM_ID"],
                    cellId: results[i]["CELL_ID"],
                    name: results[i]["ITEM_NAME"],
                    price: results[i]["PRICE"],
                    size: results[i]["SIZE"],
                    row: results[i]["ROW_INDEX"],
                    col: results[i]["COL_INDEX"],
                    color: results[i]["COLOR"]
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get info(s) successfully",
            data: lst
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get info(s)"
        });
    });
}

export default { getInfo };