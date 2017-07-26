// import { sequelize, Sequelize } from './index';
// import Area from './area-model';


// const Shelf = sequelize.define('SHELF', {
//     ID: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         notNull: true,
//         field: 'ID'
//     },
//     rowNum: {
//         type: Sequelize.INTEGER,
//         notNull: true,
//         field: 'NUM_OF_ROWS'
//     },
//     colNum: {
//         type: Sequelize.INTEGER,
//         notNull: true,
//         field: 'NUM_OF_ROWS'
//     },
//     areaID: {
//         type: Sequelize.INTEGER,
//         notNull: true,
//         field: 'AREA_ID'
//     }
// });

// Area.hasMany(Shelf, { foreignKey: 'areaID', sourceKey: 'ID' });
// Shelf.belongsTo(Area, { foreignKey: 'areaID', targetKey: 'ID' });

// export default Shelf;