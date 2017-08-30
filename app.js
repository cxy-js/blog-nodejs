var express = require("express");
var mongoose =require("mongoose")
var Flinfo = require("./models/flinfo")
var swig = require("swig")
var Register = require("./models/register")
var bodyParser = require("body-parser")
var cookies = require("cookies")
var router = require("./router/user")

//获取端口、地址
var obj = require("./models/gethostport")
var port = obj.port;
var host = obj.host;
var app = express();
//socket.io
var http= require("http").Server(app);
var io = require("socket.io")(http);
//配置模版
app.engine("html",swig.renderFile)
//设置模版目录
app.set("views","./views")
//注册模版引擎
app.set("view engine","html")
//取消模版缓存
app.set('view cache', false);
swig.setDefaults({ cache: false });
//获取post请求数据
app.use(bodyParser.urlencoded({extended:true}))
//静态资源
app.use(express.static(__dirname + "/public"))

//webSocket
io.on("connection",function(socket){
	//接收info
	socket.on("info",function(msg){
		//为所有用户派发msg，派发时间"backMsg"
		io.emit("backMsg",msg)
	})
})
//设置cookies
app.use(function(req,res,next){
	
	req.cookies = new cookies(req,res)
	
	if(req.cookies.get('username')){
		try{
			req.userinfo =req.cookies.get('username')
			
		}catch(err){

		}
		
	}
	next()
	
	
	
})

//注册
app.post("/register",router.register)

//登录
app.post("/login",router.login)

//前台退出
app.get("/logout",router.logout)
//后台管理---访问权限控制
app.get("/admin/:id",router.adminid)
//后台管理
app.get("/admin",router.admin)
//后台退出
app.get("/admin/logout",router.adminlogout)
// //修改blog
app.post("/admin/img",router.blogimg)
//后台用户管理
app.get("/admin/user",router.user)
//修改页面
app.get("/admin/user/emitshow",router.emitshow)

//修改用户执行页面
app.get("/admin/user/doemit",router.doemit)
//添加用户
app.get("/admin/user/adduser",router.adduser)
//
//添加用户执行
app.post("/admin/user/doadduser",router.doadduser)
//后台分类管理
app.get("/admin/fl",router.fl)

//后台分类添加
app.post("/admin/dofl",router.dofl)
//后台分类修改
// app.post("/admin/flemit",router.flemit)
//后台分类删除
app.post("/admin/fldel",router.fldel)
//后台文章管理
app.get("/admin/article",router.article)

//后台文章提交
app.post("/admin/doarticle",router.doarticle)


//后台友情连接
app.get("/admin/link",router.link)
//后台友情连接
app.post("/admin/link/dolink",router.dolink)
//后台友情连接修改页
app.get("/admin/link/emitlink",router.emitlink)
//后台友情连接修改
app.get("/admin/link/doemitlink",router.doemitlink)
//blog页面
 app.get("/",router.blog)

 //blog页面
app.get("/content",router.content)

 //赞
app.post("/content/zan",router.zan)

 //评论
app.post("/pl/post",router.plpost)


//连接数据库
mongoose.connect("mongodb://localhost:27017/book",function(err){
	if(err){
		console.log("连接数据库失败")
	}else{
		console.log("连接数据库成功")
		http.listen(port,host)
	}
})
	
