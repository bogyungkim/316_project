import {Pool} from 'pg';
import axios from 'axios';

import Helper from '../controller/helper';

const pool = new Pool({
  user: process.env.RDS_USER,
  host: process.env.RDS_ENDPOINT,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
});

const initializer = async (request, response) => {
  let sql;
  try {
    sql = await axios.get(process.env.QUERY_URL);
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'axios.get()', error: error });
  }
  try {
    await pool.query(sql.data, (error, result) => {
      if (error) {
        return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      } else {
        return response.status(200).json({ statusCode: 200, result: result });
      }
    });
  } catch (error) {
      return response.status(500).json({ statusCode: 500, triggeredAt: 'axios.get()', error: error });
  }
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

const checkUser = async (userInfo, type) => {
    if (userInfo) {
      return true;
    } else {
      throw (`No user with ${type}`);
    }
};

const authenticateWithUsername = async (username, password) => {
  const queryText = 'SELECT * FROM users WHERE username = $1';
  try {
    const { rows } = await pool.query(queryText, [username]);
    await checkUser(rows[0], username);
    return await checkPassword(rows[0], password);
  } catch (error) {
    throw error;
  }
};

const authenticateWithPhoneNumber = async (phoneNumber, password) => {
  const queryText = 'SELECT * FROM users WHERE phoneNumber = $1';
  try {
    const { rows } = await pool.query(queryText, [phoneNumber]);
    await checkUser(rows[0], phoneNumber);
    return await checkPassword(rows[0], password);
  } catch (error) {
    throw error;
  }
};

const checkPassword = async (user, password) => {
  try {
    const response = await Helper.comparePassword(user.password, password);
    console.log('response', response);
    if (!response) throw ("Incorrect password"); // TODO: find a better way to resolve local throw issue
    return user.username;
  } catch (error) {
    throw error;
  }
};

// ************************* Users CRUD ***************************

const getUsers = async (request, response) => {
  try {
    await pool.query('SELECT * FROM users', (error, results) => {
      if (error) return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      return response.status(200).json({ statusCode: 200, result: results.rows });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
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
}; // TODO: finish up updateUsers

const createUser = async (request, response) => {
  const { uid, username, phoneNumber, password, clout, deletedAt } = response.req.body;
  let hash;
  try {
    hash = await Helper.hashPassword(password);
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'Helper.hashPassword()', error: error });
  }

  try {
    await pool.query('INSERT INTO users (uid, username, phoneNumber, password, clout, deletedAt) VALUES ($1, $2, $3, $4, $5, $6)', [uid, username, phoneNumber, hash, clout, deletedAt], (error, result) => {
      if (error) {
        return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      }
      return response.status(200).json({ statusCode: 200, result: result });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const getOneUserByName = async (username) => {
  const queryText = 'SELECT * FROM users WHERE username = $1';
  try {
    const { rows } = await pool.query(queryText, [username]);
    if (!rows[0]) throw (`No user with username ${username}`); // TODO: need to come up with a good code
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteOneUser = (request, response) => {
  const query1 = 'update user set deletedAt = now() WHERE username = $1';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
}; //need user name

const deleteAllUsers = (request, response) => {
  const query1 = 'update user set deletedAt = now()';
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


// ************************* Post CRUD *************************** // TODO: finish up post

const getPosts = (request, response) => {
  const query2 = 'select * from post where deletedAt is null';

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
  const query1 = 'update post set deletedAt = now() where flag>=3';

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
  pool.query('update post set upVote= upVote+1 where pid = $1 AND chid = $2', [pid, chid], (error, results)=> {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).send(`upVote updated with ID: ${results}`);
  });
};

const updatePostsDownvote = (request, response) => {
  pool.query('update post set downVote= downVote+1 where pid = $1 AND chid = $2', [pid, chid], (error, results)=> {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).send(`downVote updated with ID: ${results}`);
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
  const query1 = 'update post set deletedAt = now() WHERE pid = $1 and chid = $2 and uid = $3';
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const deleteAllPosts = (request, response) => { // delete all post along with flagged user
  const { uid } = request.body;

  const query1 = 'update post set deletedAt = now() where uid = $1';
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

const updateComment = (request, response) => { //update the context of comment
  const { cid, uid, context } = request.body;
  const query1 = 'update comment set context = $3 where cid = $1 AND uid = $2'

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

const deleteOneComment = (request, response) => { //delete by the comment owner
  const { cid, uid } = request.body;

  const query1 = 'update comment set deletedAt = now() where cid = $1 AND uid = $2'
  
  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const deleteAllComments = (request, response) => { //delete all comments along with flagged post
  const { pid } = request.body;
  const query1 = 'update comment set deletedAt = now() where pid = $1'

  pool.query(query1, (error, results) => {
    console.log('results', results.rows);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

export default {
  initializer, authenticate,
  getUsers, updateUsers, createUser, getOneUserByName, deleteOneUser, deleteAllUsers,
  getChannels, createChannel, deleteOneChannel, deleteAllChannels,
  getPosts, updatePosts, createPost, deleteOnePost, deleteAllPosts, updatePostsUpvote, updatePostsDownvote,
  getComments, updateComment, createComment, deleteOneComment, deleteAllComments
};
