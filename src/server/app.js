
import app from './configs/dependencies';
import connection from './configs/connection';
import { loadCommonObj } from './middlewares/common';

(function () {
    console.log('load common obj');
    loadCommonObj().then(() => {
        app.listen(connection.port, () => {
            console.log(`Server is running on port: ${connection.port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    })
})();