

function convertToDDMMYYYY(d, sign) {
    let res = "";
    try {
        let parse = new Date(d);
        let m = parse.getMonth() + 1;
        m = m > 9 ? m.toString() : '0' + m.toString();

        res = parse.getDate().toString() + sign + 
                m + sign + 
                parse.getFullYear();
    } catch(ex) {
        return "";
    }
    return res;
}

export { convertToDDMMYYYY };