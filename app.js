const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const logger = require('koa-logger');
const router = require('./routers/router');
const body = require('koa-body');
const { join } = require('path');
const compress = require('koa-compress');
const session = require('koa-session');

//生成koa实例
const app = new Koa();

//用logger模块监听 请求的信息  ，所以是第一个注册的中间件
// app.use(logger());

//注册资源压缩模块 compress
app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

app.keys = ['Jason是个大帅b'];

//session 的配置对象
const CONFIG ={
    key: 'Sid',
    maxAge : 1000*60*60*24,
    overwrite: true,
    httpOnly: true,
    // signed: false ,//签名，确保数据安全 默认true
    rolling : true,//是否刷新过期时间
};

//注册session
app.use(session(CONFIG,app));

//配置koabody处理 post 请求数据
app.use(body());

//将静态文件目录设置为：项目根目录+/public
app.use(static(join(__dirname, "public")));

// 配置视图模板
app.use(views(join(__dirname, "views"), {
    extension: "pug"
}));


//注册路由信息
app.use(router.routes()).use(router.allowedMethods())

app.listen(3001, () => {
    console.log("项目启动成功，监听在3001端口")
})

//创建管理员用户  如果存在则返回
{
    const { db } = require('./Schema/config');
    const UserSchema = require('./Schema/user');
    const User = db.model('users',UserSchema);
    const encrypt = require('./util/encrypt')

    User.find({username : 'admin'})
        .then(data => {
            if(data.length === 0){
                //管理员不存在  创建
                new User({
                    username: 'admin',
                    password: encrypt('admin'),
                    role : 666,
                    commentNum : 0,
                    articleNum : 0
                })
                    .save()
                    .then(data => {
                        console.log('管理员用户名-> admin  密码-> admin ');
                    })
                    .catch(err=>{
                        console.log('管理员账号检查失败');
                    })

            }else {
                console.log('管理员用户名-> admin  密码-> admin ');
            }
        })
}