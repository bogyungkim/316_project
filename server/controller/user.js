import db from '../models/queries';
import Helper from './Helper';
import {Pool} from 'pg'
import bcrypt from 'bcrypt';

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: process.env.PASSWORD,
  port: process.env.API_PORT,
});

const User = {
  async login(request, response) {
    const username = "testuser"
    const password = "wording!hi"


    // const { username, phoneNumber, password } = request.body;
    // if (!(username || phoneNumber) || !password) {
    //   return response.status(400).send({'message': 'Some values are missing'});
    // }

    const queryText = 'SELECT * FROM users WHERE username = $1';

    const { rows } = await pool.query(queryText, [username]);
    
    if (!rows[0]) {
      return response.status(400).send({'message': 'The credentials you provided is incorrect'});
    }
    console.log(Helper.comparePassword(rows[0].password, password))
    if(!Helper.comparePassword(rows[0].password, password)) {
      return response.status(400).send({ 'message': 'The credentials you provided is incorrect' });
    }




    try {
      const { rows } = await db.query(queryText, [username]);
      if (!rows[0]) {
        return response.status(400).send({'message': 'The credentials you provided is incorrect'});
      }
      if(!Helper.comparePassword(rows[0].password, password)) {
        return response.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }
    } catch(error) {
      return response.status(400).send(error)
    }
  }
}

export default User;