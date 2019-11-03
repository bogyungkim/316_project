import {Pool} from 'pg'

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: process.env.PASSWORD,
  port: process.env.API_PORT,
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      response.status(400).json(error);
    }
    response.status(200).json(results);
  });
};

const createUser = (request, response) => {
  const { uid, phoneNumber, password, level, netid, deletedAt } = request.body

  pool.query('INSERT INTO users (uid, phoneNumber, password, level, netid, deletedAt) VALUES ($1, $2, $3, $4, $5, $6)', [uid, phoneNumber, password, level, netid, deletedAt], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results}`);
    response.status(200).json(results);
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { phoneNumber, password, level, netid, deletedAt } = request.body

  pool.query(
    'UPDATE users SET phoneNumber = $2, password = $3, level = $4, netid = $5, deletedAt = $6 WHERE uid = ${id}',
    [phoneNumber, password, level, netid, deletedAt],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`);
      response.status(200).json(results);
    }
  )
}

export default {
  getUsers,
  createUser,
  updateUser,
};
