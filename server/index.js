import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';

import { login } from './controller/user_controller';
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

// app.put('/users', db.updateUsers);
app.get('/users', db.getUsers);
app.post('/users', db.createUser);
app.delete('/users', db.deleteOneUser);
app.delete('/users', db.deleteAllUsers);

app.get('/channels', db.getChannels);
app.post('/channels', db.createChannel);
app.delete('/channels', db.deleteOneChanel);
app.delete('/channels', db.deleteAllChannels);

app.put('/posts', db.updatePosts);
app.get('/posts', db.getPosts);
app.post('/posts', db.createPost);
app.delete('/posts', db.deleteOnePost);
app.delete('/posts', db.deleteAllPosts);

app.put('/comments', db.updateComments);
app.get('/comments', db.getComments);
app.post('/comments', db.createComment);
app.delete('/comments', db.deleteOneComment);
app.delete('/comments', db.deleteAllComments);

app.post('/login', login);
//app.put('/flags', db.updateFlags);
app.get('/flags', db.getFlags);
app.post('/flags', db.createFlag);

app.listen(process.env.PORT, () => console.log(`app port ${process.env.PORT}`));
app.on('error', (error) => console.error('error', error));

const server = serverless(app);
export {
  server
};
