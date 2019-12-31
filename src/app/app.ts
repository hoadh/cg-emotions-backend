import express from 'express';
import path from 'path';

const app: express.Application = express();
const VIEW_DIR = '/views/';
const port = 3001;

app.use('/assets', express.static(path.join(__dirname, '../src/assets')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + VIEW_DIR + "/dashboard.html");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
