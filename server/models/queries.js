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
  var query2 = 'select * from users where deletedAt is null'

  pool.query(query2, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const updateUsers = (request, response) => {
  var query1 = 'update users u set deletedAt = now() from post as p where p.uid = u.uid and p.flag>=3'
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { uid, username, phoneNumber, password, clout, deletedAt } = request.body;

  console.log(request.body);

  pool.query('INSERT INTO users (uid, username, phoneNumber, password, clout, deletedAt) VALUES ($1, $2, $3, $4, $5, $6)', [uid, username, phoneNumber, password, clout, deletedAt], (error, results) => {
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
  var query2 = 'select * from post where deletedAt is null'

  pool.query(query2, (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const updatePosts = (request, response) => {
  var query1 = 'update post set deletedAt = now() where flag>=3'

  pool.query(query1, (error, results) => {
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
  var query2 = 'select * from comment where deletedAt is null'
  pool.query(query2, (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

const updateComments = (request, response) => {
  var query1 = 'update comment c set deletedAt = now() from post as p where p.pid = c.pid and p.flag>=3'
  pool.query(query1, (error, results) => {
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


// ************************* Flag CRUD ***************************

const getFlags = (request, response) => {
  pool.query('SELECT * FROM flag', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      response.status(400).json(error);
    }
    response.status(200).json(results.rows);
  });
};

// const updateFlags = (request, response) => {
//   pool.query('update flag f set flag +=1 where uid=1', (error, results) => {
//     console.log('results', results);
//     if (error) {
//       console.log('error', error);
//       response.status(400).json(error);
//     }
//     response.status(200).json(results.rows);
//   });
// };

const createFlag = (request, response) => {
  const {pid, num} = request.body;

  console.log(request.body);
  
  pool.query('insert into flag (pid, num) values ($1, $2)', [pid, num], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error
    }
    console.log('result', results);
    response.status(200).send(`Flag added with ID: ${results}`);
  })
};


export default {
  getUsers, updateUsers, createUser,
  getChannels, createChannel,
  getPosts, updatePosts, createPost,
  getComments, updateComments, createComment,
  getFlags, createFlag //,updateFlag
};
