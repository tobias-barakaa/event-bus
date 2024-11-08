const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
const events = [];

app.post('/event', (req, res) => {

});

app.listen(8000, () => {
    console.log('Moderation Service running on port 7000');
})