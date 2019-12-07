import db from '../models/queries';

const login = async (request, response) => {
    const { id, password } = request.body;

    if (!(id && password)) {
      return response.status(400).json({ 'statusCode': 400, 'error': "ID or Password is missing" });
    }

    try {
      const username = await db.authenticate(id, password);
      const user = await db.getOneUserByName(username);
      return response.status(200).json({ statusCode: 200, result: user });
    } catch (error) {
      console.log('user_controller error', error);
      return response.status(400).json({ statusCode: 400, error: error });
    }
  };

export {
  login,
}
