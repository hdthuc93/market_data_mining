import express from 'express';
import routes from '../routes/index-route';
import bodyParser from 'body-parser';

const app = express();

app.use('/', express.static('./dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../../../dist/index.html');
});

app.use('/api', routes);

export default app;