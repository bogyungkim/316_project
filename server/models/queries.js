import {Pool} from 'pg';
import axios from 'axios';

import Helper from '../controller/helper';

const pool = new Pool({
  user: process.env.RDS_USER,
  host: process.env.RDS_ENDPOINT,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
})

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

const getUser = async (request, response) => {
  const { uid } = request.params;

  try {
    const user = (await pool.query('SELECT * FROM users WHERE uid = $1 and deletedAt is null', [uid])).rows[0]
    if(user) response.status(200).json(user);
    else response.status(400).json(`No user with uid = ${uid}`);
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const createUser = async (request, response) => {
  const { username, phoneNumber, password, clout } = request.body;
  let hash;
  try {
    hash = await Helper.hashPassword(password);
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'Helper.hashPassword()', error: error });
  }

  try {
    await pool.query('INSERT INTO users (username, phoneNumber, password, clout) VALUES ($1, $2, $3, $4)', [username, phoneNumber, hash, clout], (error, result) => {
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
  const { cname } = request.body;

  pool.query('insert into channel (cname) values ($1)', [cname], (error, results) => {
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    console.log('result', results);
    return response.status(200).send(`Channel added with ID: ${results}`);
  });
};


// ************************* Post CRUD *************************** // TODO: finish up post

const getPostsForChannel = (request, response) => {
  const { chid } = request.params;

  const query2 = 'select * from post where deletedAt is null AND chid = $1';

  pool.query(query2, [chid], (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

const updatePostsUpvote = async (request, response) => {
  const { pid } = request.params;

  try {
    const updated = (await pool.query('update post set upVote=upVote+1 where pid = $1 returning upVote', [pid])).rows[0];
    if(updated) response.status(200).json({ newUpVote: updated.upVote });
    else response.status(400).send(`post with ${pid} doesn't exist`);
  } catch(e) {
    response.status(400).json(e);
  }
};

const updatePostsDownvote = async (request, response) => {
  const { pid } = request.params;

  try {
    const updated = (await pool.query('update post set downVote=downVote+1 where pid = $1 returning downVote', [pid])).rows[0];
    if(updated) response.status(200).json({ newDownVote: updated.downVote });
    else response.status(400).send(`post with ${pid} doesn't exist`);
  } catch(e) {
    response.status(400).json(e);
  }
};

const flagPost = async (request, response) => {
  const { pid } = request.params;

  try {
    const updatedRows = await pool.query('update post set flag=flag+1 where pid = $1 RETURNING *', [pid]);
    const toDelete = updatedRows.rows[0];

    if(!toDelete) return response.status(400).send(`post with ${pid} doesn't exist`);
    
    if(toDelete.flag >= 3) {
      const authorID = toDelete.uid;

      console.log("delete ", authorID);

      const deleteUser = 'update users set deletedAt = now() WHERE uid = $1';
      const deletePosts = 'update post set deletedAt = now() WHERE uid = $1';
      const deleteComments = 'update comment set deletedAt = now() where uid = $1';

      await Promise.all([
        pool.query(deleteUser, [authorID]),
        pool.query(deletePosts, [authorID]),
        pool.query(deleteComments, [authorID]),
      ]);

      response.status(200).json({ newFlag: toDelete.flag, banned: true });
    } else {
      response.status(200).json({ newFlag: toDelete.flag, banned: false });
    }
  } catch(error) {
    response.status(400).json(error);
  }
}

const createPost = (request, response) => {
  const { chid, uid, title, detail, photoUrl } = request.body;

  pool.query('insert into post (chid, uid, title, detail, photoUrl) values ($1, $2, $3, $4, $5)', [chid, uid, title, detail, photoUrl], (error, results) => {
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    console.log('result', results);
    return response.status(200).send(`Post added with ID: ${results}`);
  });
};

const deleteOnePost = async (request, response) => {
  const { pid, uid } = request.params;
  try {
    await pool.query('update post set deletedAt = now() WHERE pid = $1 and uid = $2', [pid, uid]);
    response.status(200).send(`delete on ${pid} success`)
  } catch(e) {
    response.status(400).json(e);
  }
};

// ************************* Comment CRUD ***************************

const getCommentsForPost = (request, response) => {
  const { pid } = request.params;
  const query2 = 'select * from comment where deletedAt is null AND pid = $1';
  pool.query(query2, [pid], (error, results) => {
    console.log('results', results);
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    return response.status(200).json(results.rows);
  });
};

// const updateComment = (request, response) => { //update the context of comment
//   const { cid, uid, context } = request.body;
//   const query1 = 'update comment set context = $3 where cid = $1 AND uid = $2'

//   pool.query(query1, (error, results) => {
//     console.log('results', results);
//     if (error) {
//       console.log('error', error);
//       return response.status(400).json(error);
//     }
//     return response.status(200).json(results.rows);
//   });
// };

const createComment = (request, response) => {
  const { pid, uid, context } = request.body;

  pool.query('insert into comment (pid, uid, context) values ($1, $2, $3)', [pid, uid, context], (error, results) => {
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    console.log('result', results);
    return response.status(200).send(`Comment added with ID: ${results}`);
  });
};

const deleteOneComment = async (request, response) => { //delete by the comment owner
  const { cid, uid } = request.body;

  try {
    await pool.query('update comment set deletedAt = now() where cid = $1 AND uid = $2', [cid, uid]);
    response.status(200).send(`delete on ${cid} success`)
  } catch(e) {
    response.status(400).json(e);
  }
};

export default {
  initializer, authenticate,
  getUser, createUser, getOneUserByName,
  getChannels, createChannel,
  getPostsForChannel, createPost, deleteOnePost, updatePostsUpvote, updatePostsDownvote, flagPost,
  getCommentsForPost, createComment, deleteOneComment
};
