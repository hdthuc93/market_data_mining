
import app from './configs/dependencies';
import connection from './configs/connection';

let server = app.listen(connection.port, () => {
    console.log(`Server is running on port: ${connection.port}`);
});