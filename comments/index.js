const express = require('express');
const bodyParser = require('body-parser'); 
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.error("Bad JSON:", error);
        return res.status(400).send({ error: "Invalid JSON" });
    }
    next();
});

app.use(cors());
const commentsByPostId = {};

app.post('/posts/:id/comments', async(req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content });

    commentsByPostId[req.params.id] = comments;
   await axios.post('http://localhost:7000/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    })

    res.status(201).send(comments);

});

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({});
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
