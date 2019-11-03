import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import {Client} from 'pg';
import bodyParser from 'body-parser';
import db from './models/queries';

const client = new Client({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: process.env.PASSWORD,
  port: process.env.API_PORT,
  connectionString: `postgres://postgres@localhost:${process.env.API_PORT}/api`
})

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

const app = express();

app.set('port', process.env.PORT || process.env.API_PORT)

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(cors());

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});
app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

app.get('/users', db.getUsers)
app.post('/users', db.createUser)

app.listen(process.env.PORT, () => console.log(`app port ${process.env.PORT}`));
