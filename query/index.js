const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts)
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    if(type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }
    if (type === 'CommentCreated') {
        const { id, content, postId } = data;
        posts[postId].comments.push({ id, content });
    };
    console.log(posts);
    res.send({});
});

app.listen(7000, () => {
    console.log('Query Service running on port 7000');
})