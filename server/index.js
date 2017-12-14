const express = require('express');

require('dotenv').config();

const app = express();


app.get('/', (req, res) =>
  res.send('Hello World!'));


app.listen(8080, () => console.log('Lstening on port 8080'));
