import {Pool} from 'pg'
import Helper from '../controller/helper'
import axios from 'axios';

const pool = new Pool({
  user: process.env.RDS_USER,
  host: process.env.RDS_ENDPOINT,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
});

const initializer = async (request, response) => {
  const sql = await axios.get('https://316-project.s3.amazonaws.com/fill.sql');
  await pool.query(sql.data, (error, result) => {
    if (error) {
      return response.status(400).json({ StatusCode: 400, Error: error});
    } else {
      return response.status(200).send({ StatusCode: 200 });
    }
  });
};

const authenticate = async (id, password) => {
  try {
    return await authenticateWithUsername(id, password);
  } catch {
    try {
      return await authenticateWithPhoneNumber(id, password);
    } catch (error) {
      throw error;
    }
  }
};

const authenticateWithUsername = async (username, password) => {
  const queryText = 'SELECT * FROM users WHERE username = $1';
  const { rows } = await pool.query(queryText, [username]);
  const user = rows[0];
  if(user) {
    return checkPassword(user, password);
  } else {
    return Promise.reject("No user with username " + username);
  }
};

const authenticateWithPhoneNumber = async (phoneNumber, password) => {
  const queryText = 'SELECT * FROM users WHERE phoneNumber = $1';
  const { rows } = await pool.query(queryText, [phoneNumber]);
  const user = rows[0];
  if(user) {
    return checkPassword(user, password);
  } else {
    return Promise.reject("No user with phoneNumber " + phoneNumber);
  }
};

const checkPassword = (user, password) => {
  if(Helper.comparePassword(user.password, password)) {
    // Optionally, Generate token, store token, return token
    return Promise.resolve(user.username);
  } else {
    return Promise.reject("Password mismatch");
  }
};

// ************************* Users CRUD ***************************

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) return Promise.reject(error);
    return response.status(200).json(results.rows);
    return Promise.resolve(results.rows);
  });
};

const updateUsers = (request, response) => {
  const query1 = 'update users u set deletedAt = now() from post as p where p.uid = u.uid and p.flag>=3'
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
}; // WIP

const createUser = async (request, response) => {
  const { uid, username, phoneNumber, password, clout, deletedAt } = response.req.body;
  const hash = await Helper.hashPassword(password);
  return await pool.query('INSERT INTO users (uid, username, phoneNumber, password, clout, deletedAt) VALUES ($1, $2, $3, $4, $5, $6)', [uid, username, phoneNumber, hash, clout, deletedAt], (error, result) => {
    if (error) {
      return response.status(400).json({ statusCode: 400, error: error});
    }
    return response.status(200).json({ statusCode: 200 });
  });
};

const getOneUserByName = async (username) => {
  const queryText = 'SELECT * FROM users WHERE username = $1';
  const { rows } = await pool.query(queryText, [username]);
  return rows[0] ? Promise.resolve(rows[0]) : Promise.reject("Can't find user with name " + username);
}; // WIP

const deleteOneUser = (request, response) => {
  const query1 = 'DELETE FROM users WHERE username = $1';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
}; //need user name and password to delete a user

const deleteAllUsers = (request, response) => {
  const query1 = 'DELETE FROM users';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

// ************************* Channel CRUD ***************************

const getChannels = (request, response) => {
  pool.query('SELECT * FROM channel', (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const createChannel = (request, response) => {
  const { chid, cname } = request.body;

  console.log(request.body);

  pool.query('insert into channel (chid, cname) values ($1, $2)', [chid, cname], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error;
    }
    console.log('result', results);
    return response.status(200).send(`Channel added with ID: ${results}`);
  });
};

const deleteOneChannel = (request, response) => {
  const query1 = 'DELETE FROM channel WHERE cname = $1';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const deleteAllChannels = (request, response) => {
  const query1 = 'DELETE FROM channel';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};


// ************************* Post CRUD ***************************

const getPosts = (request, response) => {
  const query2 = 'select * from post where deletedAt is null'

  pool.query(query2, (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const updatePosts = (request, response) => {
  const query1 = 'update post set deletedAt = now() where flag>=3'

  pool.query(query1, (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const updatePostsUpvote = (request, response) => {
  pool.query('update flag f set flag +=1 where pid = $1 and uid = $2', [pid, num], (error, results)=> {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).send(`upVote added with ID: ${results}`);
  });
};

const createPost = (request, response) => {
  const { pid, chid, uid, title, detail, photoUrl, upVote, downVote, flag, deletedAt } = request.body;

  console.log(request.body);

  pool.query('insert into post (pid, chid, uid, title, detail, photoUrl, upVote, downVote, flag, deletedAt) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [pid, chid, uid, title, detail, photoUrl, upVote, downVote, flag, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error;
    }
    console.log('result', results);
    return response.status(200).send(`Post added with ID: ${results}`);
  });
};

const deleteOnePost = (request, response) => {
  const query1 = 'DELETE FROM post WHERE pid = $1 and chid = $2';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const deleteAllPosts = (request, response) => {
  const query1 = 'DELETE FROM post';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

// ************************* Comment CRUD ***************************

const getComments = (request, response) => {
  const query2 = 'select * from comment where deletedAt is null';
  pool.query(query2, (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const updateComments = (request, response) => {
  const query1 = 'update comment c set deletedAt = now() from post as p where p.pid = c.pid and p.flag>=3';
  pool.query(query1, (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const createComment = (request, response) => {
  const { cid, uid, context, deletedAt } = request.body;

  console.log(request.body);

  pool.query('insert into comment (cid, uid, context, deletedAt) values ($1, $2, $3, $4)', [cid, uid, context, deletedAt], (error, results) => {
    if (error) {
      console.log('error', error);
      throw error;
    }
    console.log('result', results);
    return response.status(200).send(`Comment added with ID: ${results}`);
  });
};

const deleteOneComment = (request, response) => {
  const query1 = 'DELETE FROM comment WHERE cid = $1';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const deleteAllComments = (request, response) => {
  const query1 = 'DELETE FROM comment';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};


export default {
  initializer, authenticate,
  getUsers, updateUsers, createUser, getOneUserByName, deleteOneUser, deleteAllUsers,
  getChannels, createChannel, deleteOneChannel, deleteAllChannels,
  getPosts, updatePosts, createPost, deleteOnePost, deleteAllPosts,
  getComments, updateComments, createComment, deleteOneComment, deleteAllComments
};
