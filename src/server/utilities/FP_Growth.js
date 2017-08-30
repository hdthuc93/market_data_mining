class FPTree {
    constructor(nodeName = "", quan = 1, lstName = [], nextNode = {}, nextHorizNode = null) {
        this.nodeName = nodeName;
        this.lstName = lstName;
        this.quan = quan;
        this.nextNode = nextNode;
        this.nextHorizNode = nextHorizNode;
    }
};


let FPGrowth = async function (data, minSupp, minConf) {
    let res, res2, itemsLevel;
    let output = {};
    let outputFI = {};
    
    minSupp = minSupp * data.length;

    res = countItems(data, minSupp);
    itemsLevel = Object.assign({}, res.itemsLevel);
    
    res = createTree(res);

    res = createCondPatternBase(res);
    res.itemsLevel = itemsLevel;
    
    res = await calcCondPatternBase(res, minSupp);
    outputFI = res.slice();
    
    res2 = associationRule(res, minConf, data);
    output.ar = res2;

    outputFI.forEach((val, key) => {
        val.supp = Math.round((val.level / data.length) * 100) / 100;
        delete val.level;
    });

    output.fi = outputFI;
    return output;
}

let countItems = function(lstObj, minSupp) {
    let keys = Object.keys(lstObj[0]);
    let mapCount = new Map();
    for(let i = 0; i < lstObj.length; ++i) {
        for(let j = 0; j < keys.length; ++j) {
            if(lstObj[i][keys[j]] === "y") {
                if(mapCount.has(keys[j])) {
                    mapCount.set(keys[j], mapCount.get(keys[j]) + 1);
                } else {
                    mapCount.set(keys[j], 1);
                }
            }
        }
    }

    mapCount.forEach(function(value, key) {
        if(value < minSupp)
            mapCount.delete(key);
    });

    let data = [];
    let items = [];
    let itemsLevel = {};
    let outData = {};
    mapCount = Array.from(mapCount);
    mapCount.sort(function(a, b) {
        return b[1] - a[1];
    });

    for(let i = 0; i < lstObj.length; ++i) {
        data[i] = [];
        for(let j = 0; j < mapCount.length; ++j) {
            if(i === 0) {
                items.push(mapCount[j][0]);
                itemsLevel[mapCount[j][0]] = mapCount[j][1];
            }

            if(lstObj[i][mapCount[j][0]] === "y") {
                data[i].push(mapCount[j][0]);
            }
        }
    }

    outData.list = data;
    outData.items = items;
    outData.itemsLevel = itemsLevel;
    return outData;
}

let createTree = function(inData) {
    let lenData = inData.list.length;
    let lenItem = inData.items.length;
    let data = inData.list;
    let pHead = {};
    let pNode = {};
    let rootTree = new FPTree();
    let node;
    let itemName;
    let res = {};

    if(!inData.hasOwnProperty("levels")) {
        inData.levels = [];
        for(let i = 0; i < lenData; ++i) {
            inData.levels.push(1);
        }
    }

    for(let i = 0; i < lenData; ++i) {
        node = rootTree;
        for(let j = 0; j < data[i].length; ++j) {
            itemName = data[i][j];
            if(node.nextNode.hasOwnProperty(itemName)) {
                node.nextNode[itemName].quan += inData.levels[i];
            } else {
                node.nextNode[itemName] = new FPTree();
                node.nextNode[itemName].quan = inData.levels[i];
                node.nextNode[itemName].nodeName = itemName;
                node.nextNode[itemName].lstName = node.lstName.slice();
                node.nextNode[itemName].lstName.push(node.nodeName);

                if(!pHead[itemName]) {
                    pHead[itemName] = node.nextNode[itemName];
                    pNode[itemName] = pHead[itemName];
                } else {
                    pNode[itemName].nextHorizNode = node.nextNode[itemName];
                    pNode[itemName] = pNode[itemName].nextHorizNode;
                }
            }
            node = node.nextNode[itemName];
        }
    }

    res.pHead = pHead;
    res.rootTree = rootTree;
    res.items = inData.items;
    return res;
}

let createCondPatternBase = function(inData) {
    let pNode;
    let items = inData.items;
    let res = {};
    let lst;


    for(let i = 0; i < items.length; ++i) {
        lst = [];
        pNode = inData.pHead[items[i]];
        while(pNode) {
            lst.push({
                listName: pNode.lstName.slice(1),
                level: pNode.quan
            });
            pNode = pNode.nextHorizNode;
        }

        res[items[i]] = lst.slice();
    }
    res.items = inData.items;
    return res;
}


let calcCondPatternBase = async function(data, minSupp) {
    let len;
    let res = [];
    let inTreeData, outTreeData;
    let lstName, inData;
    let setName, mapNameCount;
    let pNode;
    let lastName, arrName;
    let out = [], inCombinations = [];
    let firstTime, combinationSet;
    let setPattern = new Set();

    
    for(let k = 0; k < data.items.length; ++k) {
        // console.log(k);
        setName = new Set();
        mapNameCount = new Map();
        inTreeData = {};
        inData = data[data.items[k]];
        len = inData.length;
        inTreeData.list = [];
        inTreeData.levels = [];
        for(let i = 0; i < len; ++i) {
            lstName = inData[i].listName;
            if(inData[i].listName.length > 0) {
                inTreeData.list.push(inData[i].listName.slice());
                inTreeData.levels.push(inData[i].level);
            }

            for(let j = 0; j < lstName.length; ++j) {
                setName.add(lstName[j]);
                if(mapNameCount.has(lstName[j])) {
                    mapNameCount.set(lstName[j], mapNameCount.get(lstName[j]) + inData[i].level);
                } else {
                    mapNameCount.set(lstName[j], inData[i].level);
                }
            }
        }

        inTreeData.items = Array.from(setName);

        outTreeData = createTree(inTreeData);
        
        res.push({
            name: [data.items[k]],
            level: data.itemsLevel[data.items[k]]
        });

        arrName = Array.from(mapNameCount.keys());

        while(arrName.length > 0) {
            lastName = arrName.pop();
            if(mapNameCount.get(lastName) >= minSupp)
                break;

            lastName = "";
        }
        
        
        let c = 1;
        if(lastName && lastName !== "") {
            pNode = outTreeData.pHead[lastName];
            let name, level;
            let itemsLevel;

            while(pNode) {
                ++c;
                inCombinations.length = 0;
                if(pNode.lstName.slice(1).length > 0) {
                    inCombinations = pNode.lstName.slice(1);
                }

                out.length = 0;

                inCombinations.push(pNode.nodeName);
                itemsLevel = getItemsLevel(outTreeData.rootTree, inCombinations);
                
                let a = combinationItems(inCombinations, [], out, 0, new Set());

                level = 1e10;
                for(let i = 0; i < out.length; ++i) {
                    for(let j = 0; j < out[i].length; ++j) {
                        if(level > itemsLevel[ out[i][j] ] )
                            level = itemsLevel[ out[i][j] ];
                    }

                    if(level >= minSupp) {
                        if(level > data.itemsLevel[data.items[k]])
                            level = data.itemsLevel[data.items[k]];

                        out[i].splice(0, 0, data.items[k]);

                        if(!setPattern.has(out[i].join(""))) {
                            setPattern.add(out[i].join(""));
                            res.push({
                                name: out[i].slice(),
                                level: level
                            });
                        }
                    }
                }

                pNode = pNode.nextHorizNode;
            }
        }
    }
    
    res.sort(function(a, b) {
        return a.name.length - b.name.length;
    });

    return res;
}

let getItemsLevel = function(tree, lst) {
    let lstLevel = {};
    let node = tree;
    // lstLevel[node.nodeName] = node.quan;

    for(let i = 0; i < lst.length; ++i) {
        lstLevel[lst[i]] = node.nextNode[lst[i]].quan;
        node = node.nextNode[lst[i]];
    }
    return lstLevel;
}

let combinationItems = async function(lst, lstRemain, res, index, combinationSet) {
    for(let i = index; i < lst.length; ++i) {
        lstRemain.push(lst[i]);

        if(!combinationSet.has(lstRemain.join("")))
            res.push(lstRemain.slice());

        combinationSet.add(lstRemain.join(""));
        
        await (combinationItems(lst, lstRemain, res, i + 1, combinationSet));
        lstRemain.pop(); 
    }
}


// -------------------- Association rule ----------------------------
let associationRule = function(inData, minConf, originalData) {
    let len = inData.length;
    let H1;
    let res = [];
    for(let i = 0; i < len; ++i) {
        if(inData[i].name.length > 1) {
            H1 = [];
            for(let j = 0; j < inData[i].name.length; ++j) {
                H1.push([ inData[i].name[j] ]);
            } 

            apGen(inData[i], H1, 1, minConf, originalData, res);
        }
    }

    res.sort(function(a, b) {
        return (a.from.length + a.to.length) - (b.from.length + b.to.length);
    });

    return res;
}

let apGen = function(inData, H, m, minConf, originalData, res) {
    let f = inData.name;
    let k = inData.name.length;
    let fCount = inData.level;

    if(k > m && H.length > 0) {
        let Hm;

        if(m !== 1)
            Hm = candidateGen(H);
        else
            Hm = H.slice();

        let fExceptAlpha;
        let conf;
        for(let i = 0; i < Hm.length; ++i) {
            fExceptAlpha = except(f, Hm[i]);
            conf = fCount / countGroup(originalData, fExceptAlpha);

            if(conf >= minConf) {
                res.push({
                    from: fExceptAlpha.slice(),
                    to: Hm[i].slice(),
                    conf: Math.round(conf * 100) / 100
                })
            } else {
                Hm.splice(i, 1);
                --i;
            }
        }
        apGen(inData, Hm, m + 1, minConf, originalData, res);
    }
}

let countGroup = function(data, lst) {
    let c;
    let res = 0;
    for(let i = 0; i < data.length; ++i) {
        c = 0;
        for(let j = 0; j < lst.length; ++j) {
            if(data[i][lst[j]] === "y")
                ++c;
            else
                break;
        }

        if(c === lst.length)
            ++res;
    }

    return res;
}

let except = function(f, alpha) {
    let res = [];
    for(let i = 0; i < f.length; ++i) {
        if(alpha.indexOf(f[i]) === -1)
            res.push(f[i]);
    }
    return res;
}

let candidateGen = function(lst) {
    let m = lst[0].length;
    let myMap = new Map;
    let items = [];
    let res = [];
    for(let i = 0; i < lst.length; ++i) {
        for(let j = 0; j < lst[i].length; ++j) {
            if( myMap.has(lst[i][j]) )
                myMap.set(lst[i][j], myMap.get(lst[i][j]) + 1);
            else
                myMap.set(lst[i][j], 1);
        }
    }

    myMap.forEach(function(value, key) {
        if(value === m)
            items.push(key);
    });
    
    combinationItems2(items, [], res, 0, m + 1);
    return res;
}

let combinationItems2 = function(lst, lstRemain, res, index, len) {
    for(let i = index; i < lst.length; ++i) {
        lstRemain.push(lst[i]);

        if(lstRemain.length === len)
            res.push(lstRemain.slice());
        
        combinationItems2(lst, lstRemain.slice(), res, i + 1, len);
        lstRemain.pop();
    }
}

export { FPGrowth };