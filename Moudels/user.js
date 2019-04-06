const { db } = require('../Schema/config');
//取出用户Schema 为了拿到操作 USERS 集合的实例对象
const UserSchema = require('../Schema/user');
const User = db.model('users',UserSchema);

module.exports = User;