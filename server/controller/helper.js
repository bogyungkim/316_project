import {bcrypt} from 'bcryptjs';

const Helper = {
  hashPassword(password) {
    // if (password === undefined) return "";
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }
};

export default Helper;
