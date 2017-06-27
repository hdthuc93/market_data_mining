import HocSinh from '../models/hocsinh-model';
import NamHoc from '../models/namhoc-model';
import { sequelize } from '../models/index';

function generateSchoolYear() {
    const today = new Date();
    const month = today.getUTCMonth() + 1;
    const year = today.getUTCFullYear();
    let id = '';

    id = year.toString().slice(2, 4);

    if(month > 6) {
        const nextYear = year + 1;
        id += nextYear.toString().slice(2, 4); 
    } else {
        const prevYear = year - 1;
        id = prevYear.toString().slice(2, 4) + id;
    }

    return id;
}

function generateStudentID() {
    let id = generateSchoolYear();

    return HocSinh.max('hocSinh_pkey')
    .then((quantity) => {
        if(isNaN(quantity))
            id += '0001';
        else if(quantity < 10)
            id += '000' + quantity.toString();
        else if(quantity < 100)
            id += '00' + quantity.toString();
        else if(quantity < 1000)
            id += '0' + quantity.toString();
        else 
            id += '0' + quantity.toString();
            
        return id;
    })
    .catch((err) => {
        return new Error("An error occured while generating the student id");
    });
}

function generateRegulationID(schoolYearID) {
    return NamHoc.findOne({ where: { namHoc_pkey: schoolYearID } })
    .then((result) => {
        if(result.tenNamHoc)
            return "QD" + result.tenNamHoc;
        else
            return new Error();
    })
    .catch((err) => {
        return new Error("An error occured while generating the school year id");
    });
}

export { generateSchoolYear, generateStudentID, generateRegulationID }