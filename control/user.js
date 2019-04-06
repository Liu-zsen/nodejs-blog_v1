const { db } = require('../Schema/config');
const UserSchema = require('../Schema/user');
const encrypt =require('../util/encrypt');

// 通过db对象创建操作user数据库的模型对象
const User = db.model('users',UserSchema);

//用户注册
exports.reg = async ctx=>{
    const user = ctx.request.body;
    const username = user.username;
    const password = user.username;
    //注册时
    //1,去 user 数据库查询当前发过的username是否存在(查询数据库)
    await new Promise((resolve,reject)=>{
        User.find({username},(err,data)=>{
            if(err)return reject(err)
            //判断是否有数据
            if(data.length!==0){
                //查询数据库 --》用户名已经存在
                return resolve('')
            }

            //用户名不存在，需要存到数据库(存到数据库之前要先加密)
            const _user = new User({
                username,
                password: encrypt(password),
                commentNum : 0,
                articleNum : 0
            })


            _user.save((err,data) =>{
                if(err){
                    reject(err)
                }else {
                    resolve(data)
                }
            })
        })
    }).then( async data=>{
        if(data){
            //注册成功
            await ctx.render('isOk',{
                status:'注册成功'
            })
        }else {
            //  用户名已经存在
           await ctx.render('isOk',{
                status: '用户名已经存在'
            })

        }
    }).catch(async err=>{
        await ctx.render('isOk',{
            status: '注册失败，请重试'
        })
    })



};

//用户登录
exports.login = async ctx=>{
    const user = ctx.request.body ;
    const username = user.username;
    const password = user.password;


    //进数据库查询 （异步io）
    await new Promise((resolve,reject)=>{
        //通过User查找用户名，
        User.find({username},(err,data)=>{
            if(err) reject(err); //如果err存在 ，reject出去
            if(data.length === 0) return reject("用户名不存在");

            //把用户传过来的密码 加密后跟数据库比对
            if(data[0].password === encrypt(password)){
                return resolve(data)    //比对成功返回data出去
            }
            resolve('')
        })

    })
        .then(async data =>{
            if(!data){      //
                 return ctx.render('isOk',{
                    status:'密码错误，请重新登录'
                })
            }

            //登陆成功前,让用户在他的cookie 里设置username password 加密后的密码 权限
            ctx.cookies.set('username',username, {
                domain: "localhost",        //挂载的主机名，
                path:'/',           //
                maxAge: 36e5,
                httpOnly:false,  //true 不让客户端访问这个cookie
                overwrite:false,
            });

            //用户数据库 _id 值
            ctx.cookies.set('uid', data[0]._id,{
                domain:'localhost',
                path:'/',
                maxAge: 36e5,
                httpOnly:false,
                overwrite:false,
            });

            ctx.session = {
                username : username ,
                uid : data[0]._id,
                avatar : data[0].avatar,
                role : data[0].role
            }

            //登录成功
            await ctx.render('isOk',{
                status:'用户登录成功'
            })
        })
        .catch(async err=>{
            await ctx.render('isOk',{
                status : '登录失败'
            })
        })

};

//保持用户状态
exports.keepLog = async (ctx,next)=>{   //
    if(ctx.session.isNew){  //如果为true 表示session 没有
        if(ctx.cookies.get('uid')){

            let uid = ctx.cookies.get('uid');

            const  avatar = await User.findById(uid)
            .then( data => data.avatar )

            ctx.session = {
                username : ctx.cookies.get('username'),
                uid,
                avatar
            }
        }
    }

    await next()
};

//用户退出中间件
exports.logout = async ctx=>{
    //当用户退出时。清空 cookie，session
    ctx.session = null;
    //cookie 只有set和get方法
    ctx.cookies.set('username',null ,{
        maxAge : 0
    });
    ctx.cookies.set('uid',null ,{
        maxAge : 0
    })

    //重定向到首页
    ctx.redirect("/")

}

// 用户头像上床
exports.upload = async ctx =>{
    //拿到新的头像地址
    const filename = ctx.req.file.filename;

    let data = {};

    await User.update({ _id : ctx.session.uid }, {$set : {avatar: '/avatar/' + filename}},
            (err,res) => {
                if(err){
                    data = {
                        stasus : 0,
                        message : err,
                    }
                }else {
                    data = {
                        status : 1,
                        message : "上传成功"
                    }
                }
            }
        );


    ctx.body = data
}