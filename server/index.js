import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
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

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});
app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

app.put('/users', db.updateUsers);
app.get('/users', db.getUsers);
app.post('/users', db.createUser);

app.get('/channels', db.getChannels);
app.post('/channels', db.createChannel);

app.put('/posts', db.updatePosts);
app.get('/posts', db.getPosts);
app.post('/posts', db.createPost);

app.put('/comments', db.updateComments);
app.get('/comments', db.getComments);
app.post('/comments', db.createComment);

//app.put('/flags', db.updateFlags);
app.get('/flags', db.getFlags);
app.post('/flags', db.createFlag);

app.listen(process.env.PORT, () => console.log(`app port ${process.env.PORT}`));
