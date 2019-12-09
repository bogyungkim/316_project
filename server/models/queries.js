import {Pool} from 'pg';
import axios from 'axios';

import Helper from '../controller/helper';

console.log("RUNTIME_ENV: ", process.env.RUNTIME_ENV);

const pool = process.env.RUNTIME_ENV === 'PROD' ?
  new Pool({
    user: process.env.RDS_USER,
    host: process.env.RDS_ENDPOINT,
    database: process.env.RDS_DATABASE,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
  }) :
  new Pool({
    user: process.env.LOCAL_DB_USER,
    host: process.env.LOCAL_DB_ENDPOINT,
    database: process.env.LOCAL_DB_DATABASE,
    password: process.env.LOCAL_DB_PASSWORD,
    port: process.env.LOCAL_DB_PORT,
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
  } catch (error) {
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
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    await checkUser(rows[0], username);
    return await checkPassword(rows[0], password);
  } catch (error) {
    throw error;
  }
};

const authenticateWithPhoneNumber = async (phoneNumber, password) => {
  const query = 'SELECT * FROM users WHERE phoneNumber = $1';
  try {
    const { rows } = await pool.query(query, [phoneNumber]);
    await checkUser(rows[0], phoneNumber);
    return await checkPassword(rows[0], password);
  } catch (error) {
    throw error;
  }
};

const checkPassword = async (user, password) => {
  try {
    const response = await Helper.comparePassword(user.password, password);
    if (!response) throw ("Incorrect password");
    return user.username;
  } catch (error) {
    throw error;
  }
};

// ************************* Users CRUD ***************************

const getUser = async (request, response) => {
  const { uid } = request.params;
  try {
    const query = 'SELECT * FROM users WHERE uid = $1 and deletedAt is null';
    const res = await pool.query(query, [uid]);
    const user = res.rows[0];
    if (user) response.status(200).json({ statusCode: 200, result: user });
    else response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: `No user with uid = ${uid}` });
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
    const query = 'INSERT INTO users (username, phoneNumber, password, clout) VALUES ($1, $2, $3, $4) returning uid';
    await pool.query(query, [username, phoneNumber, hash, clout], (error, result) => {
      if (error) {
        return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      }
      return response.status(200).json({ statusCode: 200, result: result.rows[0] });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const getOneUserByName = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  try {
    const { rows } = await pool.query(query, [username]);
    if (!rows[0]) throw (`No user with username ${username}`);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// ************************* Channel CRUD ***************************

const getChannels = async (request, response) => {
  try {
    pool.query('SELECT * FROM channel', (error, results) => {
      if (error) return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      return response.status(200).json({ statusCode: 200, result: results.rows });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const createChannel = async (request, response) => {
  const { cname } = request.body;

  pool.query('insert into channel (cname) values ($1) returning chid', [cname], (error, results) => {
    if (error) {
      console.log('error', error);
      return response.status(400).json(error);
    }
    console.log('result', results);
    return response.status(200).json(results.rows[0]);
  });
};


// ************************* Post CRUD ***************************

const getPostsForChannel = async (request, response) => {
  const { chid } = request.params;

  try {
    const getPosts = 'select * from post where deletedAt is null AND chid = $1';
    const posts = (await pool.query(getPosts, [chid])).rows;
    const pids = posts.map(post => post.pid);

    const getVotes = `select * from votes where pid in (${pids.join(', ')})`;
    const getFlags = `select * from flags where pid in (${pids.join(', ')})`;
    const [votes, flags] = await Promise.all([
      pool.query(getVotes, []).then(results => results.rows),
      pool.query(getFlags, []).then(results => results.rows),
    ]);

    const finalPosts = posts.map(post => 
      Object.assign(
        post, 
        { upVotes: votes.filter(v => v.pid == post.pid && v.isupvote ).map(v => v.uid) },
        { downVotes: votes.filter(v => v.pid == post.pid && !v.isupvote ).map(v => v.uid) },
        { flags: flags.filter(f => f.pid == post.pid ).map(f => f.uid) }
      )
    )

    return response.status(200).json({ statusCode: 200, results: finalPosts });
  } catch (error) {
    console.log(error)
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const togglePostsUpvote = async (request, response) => {
  const { uid, pid } = request.params;

  try {
    const query = 'select * from votes where uid = $1 and pid = $2';
    const res = (await pool.query(query, [uid, pid])).rows[0];

    if(res) {
      if(res.isupvote) {
        const deleteQ = 'delete from votes where vid = $1';
        await pool.query(deleteQ, [res.vid]);
        return response.status(200).json({ statusCode: 200, result: { isUpVote: false, isDownVote: false }})
      } else {
        const updateQ = 'update votes set isUpVote = $1 where vid = $2';
        await pool.query(updateQ, [true, res.vid]);
        return response.status(200).json({ statusCode: 200, result: { isUpVote: true, isDownVote: false }})
      }
    } else {
      const insertQ = 'insert into votes (uid, pid, isUpVote) values ($1, $2, $3)';
      await pool.query(insertQ, [uid, pid, true]);
      return response.status(200).json({ statusCode: 200, result: { isUpVote: true, isDownVote: false }})
    }
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const togglePostsDownvote = async (request, response) => {
  const { uid, pid } = request.params;

  try {
    const query = 'select * from votes where uid = $1 and pid = $2 ';
    const res = (await pool.query(query, [uid, pid])).rows[0];
    if(res) {
      if(!res.isupvote) {
        const deleteQ = 'delete from votes where vid = $1';
        await pool.query(deleteQ, [res.vid]);
        return response.status(200).json({ statusCode: 200, result: { isUpVote: false, isDownVote: false }})
      } else {
        const updateQ = 'update votes set isUpVote = $1 where vid = $2';
        await pool.query(updateQ, [false, res.vid]);
        return response.status(200).json({ statusCode: 200, result: { isUpVote: false, isDownVote: true }})
      }
    } else {
      const insertQ = 'insert into votes (uid, pid, isUpVote) values ($1, $2, $3)';
      await pool.query(insertQ, [uid, pid, false]);
      return response.status(200).json({ statusCode: 200, result: { isUpVote: false, isDownVote: true  }})
    }
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const toggleFlagPost = async (request, response) => {
  const { uid, pid } = request.params;

  try {
    const query = 'select * from flags where uid = $1 and pid = $2';
    const res = (await pool.query(query, [uid, pid])).rows[0];
    if(res) {
      const deleteQ = 'delete from flags where fid = $1';
      await pool.query(deleteQ, [res.fid]);
      return response.status(200).json({ statusCode: 200, result: { exists: false, banned: false }})
    } else {
      const insertQ = 'insert into flags (uid, pid) values ($1, $2)';
      await pool.query(insertQ, [uid, pid]);

      const [post, numFlags] = await Promise.all([
        pool.query('select * from post where pid = $1', [pid]).then(r => r.rows[0]),
        pool.query('select * from flags where pid = $1', [pid]).then(r => r.rows.length),
      ]);
        
      if (numFlags >= 3) {
        const authorID = post.uid;
        const deleteUser = 'update users set deletedAt = now() WHERE uid = $1';
        const deletePosts = 'update post set deletedAt = now() WHERE uid = $1';
        const deleteComments = 'update comment set deletedAt = now() where uid = $1';
  
        await Promise.all([
          pool.query(deleteUser, [authorID]),
          pool.query(deletePosts, [authorID]),
          pool.query(deleteComments, [authorID]),
        ]);
        return response.status(200).json({ statusCode: 200, result: { exists: true, banned: true } });
      }

      return response.status(200).json({ statusCode: 200, result: { exists: true, banned: false } });
    }
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const createPost = async (request, response) => {
  const { chid, uid, title, detail, photoUrl } = request.body;

  try {
    const query = 'insert into post (chid, uid, title, detail, photoUrl) values ($1, $2, $3, $4, $5) returning pid';
    await pool.query(query, [chid, uid, title, detail, photoUrl], (error, results) => {
      if (error) return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      return response.status(200).send({ statusCode: 200, result: results.rows[0] });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const deleteOnePost = async (request, response) => {
  const { pid, uid } = request.params;
  try {
    const query = 'update post set deletedAt = now() WHERE pid = $1 and uid = $2';
    await pool.query(query, [pid, uid], (error, results) => {
      if (error) return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      return response.status(200).json({ statusCode: 200, result: results });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

// ************************* Comment CRUD ***************************

const getCommentsForPost = async (request, response) => {
  const { pid } = request.params;
  try {
    const query = 'select * from comment where deletedAt is null AND pid = $1';
    await pool.query(query, [pid], (error, results) => {
      if (error) return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      return response.status(200).json({ statusCode: 200, result: results.rows });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
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

const createComment = async (request, response) => {
  const { pid, uid, context } = request.body;
  try {
    const query = 'insert into comment (pid, uid, context) values ($1, $2, $3) returning cid';
    pool.query(query, [pid, uid, context], (error, results) => {
      if (error) return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      return response.status(200).send({ statusCode: 200, result: results.rows[0] });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

const deleteOneComment = async (request, response) => {
  const { cid, uid } = request.body;

  try {
    const query = 'update comment set deletedAt = now() where cid = $1 AND uid = $2';
    await pool.query(query, [cid, uid], (error, results) => {
      if (error) return response.status(400).json({ statusCode: 400, triggeredAt: 'pool.query()', error: error });
      return response.status(200).send({ statusCode: 200, result: results });
    });
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 'pool.query()', error: error });
  }
};

export default {
  initializer, authenticate,
  getUser, createUser, getOneUserByName,
  getChannels, createChannel,
  getPostsForChannel, createPost, deleteOnePost, togglePostsUpvote, togglePostsDownvote, toggleFlagPost,
  getCommentsForPost, createComment, deleteOneComment
};
