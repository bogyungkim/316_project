import {Pool} from 'pg'

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: process.env.PASSWORD,
  port: process.env.API_PORT,
});

const getUsers = (request, response) => {
  // response.send("hello")
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      response.status(400).json(error);
    }
    response.status(200).json(results);
  });
};

const createUser = (request, response) => {
  //const { uid, phoneNumber, password, level, netid, deletedAt } = request.body;

  // pool.query('', (error, result) => {
  //   // 'INSERT INTO users (uid, phoneNumber, password, level, netid, deletedAt) VALUES' +
  //   //     '(2, \$\'9195648686\', \$\'123123\', \$1, \$\'yk154\', \$NULL), [uid, phoneNumber, password, level, netid, deletedAt]'
  //   if (error) {
  //     response.status(400).send(`Error detected ${error}`);
  //   }
  //   response.status(201).send(`User added ${result}`);
  // });
  
  
  //pool.query("INSERT INTO users (uid, phoneNumber, password, level, netid, deletedAt) values ($1, $2, $3, $4, $5, $6) ", [2, '9195648686', '123123', 1, 'yk154', NULL], callBack)

  var format = require('pg-format');

  var values = [
    [2, '9195648686', '123123', 1, 'yk154', NULL]
  ];
  console.log(format('INSERT INTO users (uid, phoneNumber, password, level, netid, deletedAt) VALUES %L', values));

};

export default {
  getUsers,
  createUser,
};
