const { db } = require('../Schema/config');


// const User = require('../Moudels/user');
// const Article = require('../Moudels/article');
// const Comment = require('../Moudels/comment');
//去用户的Schema 拿到操作user 集合的实例对象
const UserSchema = require('../Schema/user');
const User = db.model('users' ,UserSchema);

// 通过db对象创建操作user数据库的模型对象
const ArticleSchema = require('../Schema/article');
const Article = db.model('articles',ArticleSchema);

// 通过db对象创建操作user数据库的模型对象
const CommentSchema = require('../Schema/comment');
const Comment = db.model('comments',CommentSchema);


const fs = require('fs');
const { join } =require('path');

exports.index = async ctx =>{
    if(ctx.session.isNew){
        //没登录
        ctx.status = 404;
        return ctx.render('404',{title: '404'})
    }

    const id = ctx.params.id;

    const arr = fs.readdirSync(join(__dirname,'../views/admin'));

    let flag = false;

    arr.forEach(v => {

        let name = v.replace(/^(admin\-)|(\.pug)$/g, '')

        if(name === id){
            flag = true;
        }
    });

    if(flag){
        await ctx.render('./admin/admin-'+id,{
            role : ctx.session.role,
        })
    }else {
        ctx.status = 404;
        await ctx.render('404',{title:'404'})
    }

}