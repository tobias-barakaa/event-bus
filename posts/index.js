const express = require('express');
const bodyParser = require('body-parser'); 
const { randomBytes } = require('crypto');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(bodyParser.json());
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.error("Bad JSON:", error);
        return res.status(400).send({ error: "Invalid JSON" });
    }
    next();
});
app.use(cors());
const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts)

});

app.post('/posts', async(req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };
   await axios.post('http://localhost:7000/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    }).catch((err) => {
        console.log(err.message);
    })
    res.status(201).send(posts[id]);
})

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({});
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
