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
//   database: process.env.RDS_DATABASE,
//   password: process.env.RDS_PASSWORD,
//   port: process.env.RDS_PORT,
// });

// ************************* Users CRUD ***************************

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { uid, phoneNumber, password, level, netid, deletedAt } = request.body;

  console.log(request.body);

  pool.query('INSERT INTO users (uid, phoneNumber, password, level, netid, deletedAt) VALUES ($1, $2, $3, $4, $5, $6)', [uid, phoneNumber, password, level, netid, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`User added with ID: ${results}`);
  })
};

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
  const { chid } = request.body;

  console.log(request.body);
  
  pool.query('insert into channel (chid) values ($1)', [chid], (error, results) => {
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
  const { pid, chid, uid, pContext, vote, location, report, netid, deletedAt } = request.body;

  console.log(request.body);
  
  pool.query('insert into post (pid, chid, uid, pContext, vote, location, report, netid, deletedAt) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [pid, chid, uid, pContext, vote, location, report, netid, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Channel added with ID: ${results}`);
  })
};



// ************************* Comment CRUD ***************************

// ''

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
  const { cid, uid, vote, cContext, report, netid, deletedAt } = request.body;

  console.log(request.body);
  
  pool.query('insert into comment (cid, uid, vote, cContext, report, netid, deletedAt) values ($1, $2, $3, $4, $5, $6, $7)', [cid, uid, vote, cContext, report, netid, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Channel added with ID: ${results}`);
  })
};



// ************************* Publisher CRUD ***************************

// 


const getPublishes = (request, response) => {
  pool.query('SELECT * FROM publishes', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const createPublishes = (request, response) => {
  const { pid, uid, time } = request.body;

  console.log(request.body);
  
  pool.query('insert into publishes (pid, uid, time) values ($1, $2, $3)', [pid, uid, time], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Channel added with ID: ${results}`);
  })
};

export default {
  getUsers, createUser,
  getChannels, createChannel,
  getPosts, createPost,
  getComments, createComment,
  getPublishes, createPublishes,
};
