import {Pool} from 'pg'
import Helper from '../controller/helper'
var promiseAny = require('promise-any');


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
//   database: process.env.RDS_DATABASE,
//   password: process.env.RDS_PASSWORD,
//   port: process.env.RDS_PORT,
// });

const authenticate = (id, password) => {
  return promiseAny([
    authenticateWithUsername(id, password),
    authenticateWithPhoneNumber(id, password)
  ]); 
}

const authenticateWithUsername = async (username, password) => {
  const queryText = 'SELECT * FROM users WHERE username = $1';
  const { rows } = await pool.query(queryText, [username]);
  const user = rows[0];
  if(user) {
    return checkPassword(user, password);
  } else {
    return Promise.reject("No user with username " + username);
  }
}

const authenticateWithPhoneNumber = async (phonenumber, password) => {
  const queryText = 'SELECT * FROM users WHERE phonenumber = $1';
  const { rows } = await pool.query(queryText, [phonenumber]);
  const user = rows[0];
  if(user) {
    return checkPassword(user, password);
  } else {
    return Promise.reject("No user with phonenumber " + phonenumber);
  }
}

const checkPassword = (user, password) => {
  if(Helper.comparePassword(user.password, password)) {
    // Optionally, Generate token, store token, return token
    return Promise.resolve(user.username);
  } else {
    return Promise.reject("Password mismatch");
  }
}

// ************************* Users CRUD ***************************

const getUsers = () => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) return Promise.reject(error);
    return Promise.resolve(result.rows);
  });
};

const createUser = (user) => {
  const { uid, username, phoneNumber, password, clout, deletedAt } = user;
  const hash = Helper.hashPassword(password);
  return pool.query('INSERT INTO users (uid, username, phoneNumber, password, clout, deletedAt) VALUES ($1, $2, $3, $4, $5, $6)', [uid, username, phoneNumber, hash, clout, deletedAt], (error, results) => {
    if (error) { return Promise.reject(error); }
    return Promise.resolve();
  });
};

const getOneUserByName = async (username) => {
  const queryText = 'SELECT * FROM users WHERE username = $1';
  const { rows } = await pool.query(queryText, [username]);
  return rows[0] ? Promise.resolve(rows[0]) : Promise.reject("Can't find user with name " + name)
}

// ************************* Channel CRUD ***************************

const getChannels = (request, response) => {
  pool.query('SELECT * FROM channel', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const createChannel = (request, response) => {
  const { chid, cname } = request.body;

  console.log(request.body);
  
  pool.query('insert into channel (chid, cname) values ($1, $2)', [chid, cname], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Channel added with ID: ${results}`);
  })
};


// ************************* Post CRUD ***************************

const getPosts = (request, response) => {
  pool.query('SELECT * FROM post', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const createPost = (request, response) => {
  const { pid, chid, uid, title, detail, photoUrl, upVote, downVote, flag, deletedAt } = request.body;

  console.log(request.body);
  
  pool.query('insert into post (pid, chid, uid, title, detail, photoUrl, upVote, downVote, flag, deletedAt) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [pid, chid, uid, title, detail, photoUrl, upVote, downVote, flag, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Channel added with ID: ${results}`);
  })
};

// ************************* Comment CRUD ***************************

const getComments = (request, response) => {
  pool.query('SELECT * FROM comment', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const createComment = (request, response) => {
  const { cid, uid, context, deletedAt } = request.body;

  console.log(request.body);
  
  pool.query('insert into comment (cid, uid, context, deletedAt) values ($1, $2, $3, $4)', [cid, uid, context, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Channel added with ID: ${results}`);
  })
};


export default {
  authenticate,
  getUsers, createUser, getOneUserByName,
  getChannels, createChannel,
  getPosts, createPost,
  getComments, createComment
};
