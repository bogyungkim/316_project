import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';

import { login } from './controller/user_controller';
import upload from './controller/upload_controller';
import db from './models/queries';

const app = express();

app.set('port', process.env.PORT || process.env.API_PORT);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.get('/', async (req, res, next) => {
  const response = {
    status: 200,
    method: 'GET',
    body: 'success'
  };
  await res.status(200).send(response);
});

app.post('/', async (req, res, next) => {
  const response = {
    status: 200,
    method: 'POST',
    body: 'success'
  };
  await res.status(200).send(response);
});

app.post('/initializer', db.initializer);
app.post('/login', login);
app.post('/upload', upload);

// app.put('/users', db.updateUsers);
app.get('/users/:uid', db.getUser);
app.post('/users', db.createUser);

app.get('/channels', db.getChannels);
app.post('/channels', db.createChannel);

app.get('/posts/:chid', db.getPostsForChannel);
app.post('/posts', db.createPost);
app.post('/posts/:pid/upvote', db.updatePostsUpvote);
app.post('/posts/:pid/downvote', db.updatePostsDownvote);
app.post('/posts/:pid/flag', db.flagPost);
app.delete('/posts/:pid/:uid', db.deleteOnePost);

app.get('/comments/:pid', db.getCommentsForPost);
app.post('/comments', db.createComment);
app.delete('/comments/:cid/:uid', db.deleteOneComment);

app.listen(process.env.PORT, () => console.log(`APP PORT ${process.env.PORT}`));
app.on('error', (error) => console.error('error', error));

const server = serverless(app);
export {
  server
};
