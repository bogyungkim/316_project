import db from '../models/queries';

const User = {
  async login(request, response) {
    const { id, password } = request.body;

    if (!(id && password)) {
      return response.status(400).send({'message': 'Some values are missing'});
    }

    try {
      const username = await db.authenticate(id, password);
      const user = await db.getOneUserByName(username);
      return response.status(200).json(user);
    } catch(error) {
      console.log(error);
      return response.status(400).send(error.message);
    }
  }
}

export default User;