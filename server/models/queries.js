import {Pool} from 'pg'

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: process.env.PASSWORD,
  port: process.env.API_PORT,
});

// const pool = new Pool({
//   user: process.env.RDS_USER,
//   host: process.env.RDS_ENDPOINT,
//   database: process.env.DATABASE,
//   password: process.env.RDS_PASSWORD,
//   port: process.env.RDS_PORT,
// });

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results);
  });
};

const createUser = (request, response) => {
  const { uid, phoneNumber, password, level, netid, deletedAt } = request.body;

  console.log(request.body);
  // pool.query

  // return response.status(200).send('succeed');
  pool.query('INSERT INTO users (uid, phoneNumber, password, level, netid, deletedAt) VALUES ($1, $2, $3, $4, $5, $6)', [uid, phoneNumber, password, level, netid, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`User added with ID: ${results}`);
  })
};




//createChannel
const createChannel = (request, response) => {
  const { chid } = request.body;

  console.log(request.body);
  // pool.query

  // return response.status(200).send('succeed');
  pool.query('insert into channel (chid) values ($1)', [chid], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Channel added with ID: ${results}`);
  })
};

//getChannel
const getChannel = (request, response) => {
  pool.query('SELECT * FROM channel', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results);
  });
};

//createPost
const createPost = (request, response) => {
  const { pid, chid, uid, pContext, vote, location, report, netid, deletedAt } = request.body;

  console.log(request.body);
  // pool.query

  // return response.status(200).send('succeed');
  pool.query('insert into post (pid, chid, uid, pContext, vote, location, report, netid, deletedAt) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [pid, chid, uid, pContext, vote, location, report, netid, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Channel added with ID: ${results}`);
  })
};

//getPost
const getPost = (request, response) => {
  pool.query('SELECT * FROM post', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results);
  });
};


// 'insert into channel (chid) values ($1)'
// 'insert into post (pid, chid, uid, pContext, vote, location, report, netid, deletedAt) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
// 'insert into comment (cid, uid, vote, cContext, report, netid, deletedAt) values ($1, $2, $3, $4, $5, $6, $7)'
// 'insert into publishes (pid, uid, time) values ($1, $2, $3)'


//BELOW IS AWS APIS

// const createTable = (request, response) => {
//   pool.query('CREATE TABLE users (uid INTEGER NOT NULL PRIMARY KEY, phoneNumber CHAR(10) NOT NULL UNIQUE, password VARCHAR(256) NOT NULL, level INTEGER NOT NULL, netid VARCHAR(32), deletedAt TIMESTAMP default NULL)',
//     (error, results) => {
//     console.log('error', error);
//     if (error) return response.status(400).send(error);
//     return response.status(200).send(results);
//     })
// };

export default {
  getUsers,
  createUser,
  //createTable
};
