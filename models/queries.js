const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
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
  const { name, email } = request.body;

  pool.query('', (error, result) => {
    'INSERT INTO users (uid, phoneNumber, password, level, netid, deletedAt) VALUES' +
        '(2, $'9195648686', $'123123', $1, $'yk154', $NULL), [uid, phoneNumber, password, level, netid, deletedAt]'
    if (error) {
      response.status(400).send(`Error detected ${error}`);
    }
    response.status(201).send(`User added ${result}`);
  });
};

export default {
  getUsers,
  createUser,
};
