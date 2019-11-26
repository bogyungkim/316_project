import bcrypt from 'bcryptjs';

class Helper {
  static async hashPassword(password) {
    return await bcrypt.hashSync(password, await bcrypt.genSaltSync(8));
  }

  static async comparePassword(hashPassword, password) {
    return await bcrypt.compareSync(password, hashPassword);
  }
}

export default Helper;
