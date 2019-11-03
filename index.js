import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import {Pool, Client} from 'pg';
import bodyParser from 'body-parser';
import db from './models/queries';

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: process.env.PASSWORD,
  port: process.env.API_PORT,
});

const connectionString = async () => {
  return await `postgres://postgres@localhost:${process.env.API_PORT}/api`;
}

const client = async () => {
  return await new Client({
    connectionString: connectionString
  });
}

client.connect();

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
  return res.send('Received a GwET HTTP method');
});
app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

app.get('/users', db.getUsers)
app.post('/users', db.createUser)

app.listen(process.env.PORT, () => console.log(`app port ${process.env.PORT}`));