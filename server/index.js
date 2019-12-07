import 'dotenv/config';
import cors from 'cors';
import axios from 'axios';
import express from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';

import user_controller from './controller/user_controller';
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

app.get('/channels', db.getChannels);
app.post('/channels', db.createChannel);

app.put('/posts', db.updatePosts);
app.get('/posts', db.getPosts);
app.post('/posts', db.createPost);

app.put('/comments', db.updateComments);
app.get('/comments', db.getComments);
app.post('/comments', db.createComment);

app.post('/login', user_controller.login);
app.get('/flags', db.getFlags);
app.post('/flags', db.createFlag);

app.listen(process.env.PORT, () => console.log(`app port ${process.env.PORT}`));
app.on('error', (result) => console.log(result));

const server = serverless(app);
export {
  server
};
