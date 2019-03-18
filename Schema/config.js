//连接数据库 ，导出db Schema
const mongoose = require('mongoose');
const db = mongoose.createConnection
('mongodb://localhost:27017/nodeblog',{useNewUrlParser:true})

//用原生ES6的promise 代替 mongoose自实现的Promise
mongoose.Promise = global.Promise;

//导出Schema
const Schema = mongoose.Schema;

db.on('err',()=>{
    console.log('连接数据库失败');
});
db.on('open',()=>{
    console.log('数据库连接成功');
});


module.exports = {db,Schema};
