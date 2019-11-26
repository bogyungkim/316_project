import bcrypt from 'bcryptjs';

// class Helper {
//   async hashPassword(password) {
//
//   }
// }
const Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }
};

export default Helper;
