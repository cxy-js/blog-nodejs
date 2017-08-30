var Register = require("../models/register")
var Flinfo = require("../models/flinfo")
var Article = require("../models/content")
var Link = require("../models/link")
var Img = require("../models/images")
var md5 = require("../models/md5/md5")


//注册
exports.register = function(req,res){

	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;
	var date = new Date().toLocaleString()
	if(username==""){
		res.send("1")
		return
	}
	
	if(password=="" || repassword==""){
		res.send("2")
		return
	}
	if(password!=repassword){
		res.send("3")
		return
	}
	//查询数据库是否存在重名
	Register.findOne({
		username:username
	}).then(function(result){
			if(result){
				res.send("4")//用户已存在
				return
			}
			if(!result){
				//保存数据
				var pw = md5("你来"+md5(password)+"打我呀")
				var r = new Register({username:username,password:pw,date:date});
				r.save().then(function(result1){				
					
					
					req.cookies.set("username",result1.username)
					
					res.send("0")//注册成功

				})
			}
			
		})

}

//登录

exports.login = function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	
	if(username==""){
		res.send("1")
		return
	}
	if(password==""){
		res.send("2")
		return
	}
	
	//查询数据库是否存此用户
	//加密密码
	var pw = md5("你来"+md5(password)+"打我呀")
	//查到一条就ok
	Register.findOne({
		username:username,
		password:pw
	}).then(function(result){

			if(!result){
				res.send("5")//用户不存在
				return
			}
			if(result.password!=pw){
				res.send("6")//密码错误
				return
			}
			// console.log(result.username)

			req.cookies.set("username",result.username)

			res.send("3")//登录成功
			
		})
};

//退出
exports.logout = function(req,res){
	req.cookies.set("username",null)
	//2表示cookies为null
	res.send("2");

}
//退出
exports.adminlogout = function(req,res){
	req.cookies.set("username",null)
	//2表示cookies为null
	res.redirect("/")
	

}
//访问权限控制
exports.adminid = function(req,res,next){
	if(req.userinfo){
		next()
	}else{
		res.render("reception/404")
	}
	
}
//后台管理首页
exports.admin = function(req,res){
	//blog
	if(req.userinfo){
		Img.find().then(function(allimg){
			if(allimg.length==0){
				res.render("Backstage/adminuser",{
					username:req.userinfo,
				})
			}
				res.render("Backstage/adminuser",{
				username:req.userinfo,
				images:allimg[allimg.length-1].img
			})
			
		})
	}else{
		res.render("reception/404")
	}
}

//blog图片
exports.blogimg = function(req,res){
	var img = req.body.img
	Img.findOne({img:img}).then(function(oldimg){
		if(oldimg){
			res.send("1")//此图已存在
			return
		}
		if(!oldimg){
			new Img({img:img}).save().then(function(newimg){
				res.send("2")
			})
		}
		
	})
}

//修改用户获取id
exports.emitshow = function(req,res){
	res.render("Backstage/emitshow",{
		id:req.query.id
	})
}
//修改用户执行
exports.doemit = function(req,res){
	//如果用post请求的话
	//req.body.password
	var username = req.query.username;
	var password = req.query.password;
	var pw = md5("你来"+md5(password)+"打我呀");
	var id= req.query.id;
	//修改前进行判断
	if(username==""){
		res.send("1")
		return
	}
	
	if(password==""){
		res.send("2")
		return
	}
	//以上都符合再查看是否有重名
	Register.findOne({
		username:username
	}).then(function(result){

		if(result){
			res.send("4")//用户名已存在
			return
		}
		//修改用户
		Register.update({_id:id},{username:username,password:pw}).then(function(err){
	
			if(err.ok==1){
				res.json("5")//修改成功

				return
			}
			res.json("-5")
		})
	})
	
	
}

//用户列表
 exports.user = function(req,res){

	//删除用户
	var username =req.query.username
	Register.remove({username:username}).then(function(){})
	//count总个数
	Register.count().then(function(count){

		var page =Number(req.query.page || 1);//默认第一页
		var limit=5;//每页限制显示5个
		var	pages = Math.ceil(count/limit)//总页数
			page = Math.min(page,pages)
			page = Math.max(page,1)
		var skip=(page-1)*limit//跳过几个
		Register.find().limit(limit).skip(skip).then(function(result){
			
			res.render("Backstage/user",{
				data:result,
				page:page,
				pages:pages,
				count:count,
				username:req.userinfo 
			})
		})

	});

}
//添加用户
exports.adduser = function(req,res){
	res.render("Backstage/adduser")
}
//添加用户执行
exports.doadduser = function(req,res){
	
	var username = req.body.username;
	var password = req.body.password;
	var pw = md5("你来"+md5(password)+"打我呀");
	var date = new Date().toLocaleString()
	//添加前进行判断
	if(username==""){
		res.send("1")
		return
	}
	
	if(password==""){
		res.send("2")
		return
	}
	//以上都符合再查看是否有重名
	Register.findOne({
		username:username
	}).then(function(result){

		if(result){
			res.send("4")//用户名已存在
			return
		}
		new Register({username:username,password:pw,date:date}).save().then(function(newdata){
			console.log(newdata)
			res.json(newdata)
		})
		
	})
	
	
}





//分类展示
exports.fl = function(req,res){
	//sort排序 -1=》后添加的在前 1=》先添加的在前
	
	Flinfo.find().sort({_id:-1}).then(function(result){
		//给前端分类数据，渲染fl页面
		res.render("Backstage/fl",{
			data:result,
			username:req.userinfo 
		})
	})
	
}
//执行添加分类信息
exports.dofl = function(req,res){
	var flname=req.body.flname
	if(flname==""){
			res.send("1")//分类名不能为空
			return
		}
	
	Flinfo.findOne({flname:flname}).then(function(result){
		if(result){
			res.send("2")//分类名存在
			
			return
		}
		//不存在写入数据库
		if(!result){
			var FL = new Flinfo({flname:flname})
			FL.save().then(function(re){
				res.send("3")//写如数据库
				
			})
		}
	})
}
//修改分类
// exports.flemit = function(req,res){
// 	var flname=req.body.flname
// 	console.log(req.body)
// 	if(flname==""){
// 			res.send("1")//分类名不能为空
// 			return
// 		}
	
// 	Flinfo.findOne({flname:flname}).then(function(result){

// 		if(!result){
// 			res.send("2")//分类不存在
// 			return
// 		}
// 		if(result){
// 			Flinfo.update({flname:flname},{flname:flname}).then(function(result){
// 				res.send("3")//修改成功
// 			})
			
// 		}
		
// 	})
// }
//删除分类
exports.fldel = function(req,res){
	var flname=req.body.flname
	if(flname==""){
			res.send("1")//分类名不能为空
			return
		}
	
	Flinfo.findOne({flname:flname}).then(function(result){
		if(!result){
			res.send("2")//分类不存在
			return
		}
		if(result){
			Flinfo.remove({flname:flname}).then(function(re){})
			res.send("3")
			return
		}
		
	})
}

//后台文章管理显示
exports.article = function(req,res){
	var id =req.query.id
	Article.remove({_id:id}).then(function(err){
		if(err){
			console.log(err)
		}
	})
	//查询分类
	Flinfo.find().sort({_id:-1}).then(function(fldata){
			//查询文章
		Article.count().then(function(count){
			//分页
			var page =Number(req.query.page || 1);//默认第一页
			var limit=10;//每页限制显示5个
			var	pages = Math.ceil(count/limit)//总页数
				page = Math.min(page,pages)
				page = Math.max(page,1)
			var skip=(page-1)*limit//跳过几个
			Article.find().sort({_id:-1}).limit(limit).skip(skip).populate("category").then(function(articledata){
				//渲染文章页面
				console.log(articledata)
				res.render("Backstage/article",{
					article:articledata,
					page:page,
					pages:pages,
					count:count,
					flinfo:fldata,
					username:req.userinfo 
				})
			})

		});
	})
}
//文章提交的执行
exports.doarticle = function(req,res){

	var category = req.body.category;
	var title = req.body.title;
	var content = req.body.content;
	var author = req.userinfo;
	var date = new Date().toLocaleString()
	if(category==""){
		res.send("0")//分类必须选
		return
	}
	if(title==""){
		res.send("1")//标题不能为空
		return
	}
	if(content==""){
		res.send("2")//内容不能为空
		return
	}
	Article.findOne({
		title:title,
		content:content
	}).then(function(result){
		if(result){
			res.send("3")//文章已存在
			return
		}
		var ar = new Article({
			category:category,
			title:title,
			content:content,
			author:author,
			date:date
		});
		ar.save().then(function(r){
			res.send("4")
		})
	})
}
//后台文章管理执行
// exports.article = function(req,res){
// 	res.render("article",{
// 		username:req.userinfo 
// 	})
// }
// 友情连接
exports.link = function(req,res){
	var id =req.query.id
	Link.remove({_id:id}).then(function(){})
		Link.find().sort({_id:-1}).then(function(result){
			
			res.render("Backstage/links",{
			username:req.userinfo,
			links:result
		})
	})
	
}
//友情连接
exports.dolink = function(req,res){
	var linkname = req.body.linkname
	var linkaddress = req.body.linkaddress
	Link.findOne({
		linkname:linkname,
		linkaddress:linkaddress
	}).sort({_id:-1}).then(function(result){
		if(result){
			res.send("2")//连接已存在
			return
		}
		new Link({
			linkname:linkname,
			linkaddress:linkaddress
		}).save().then(function(re){
			res.send("3")
		})
	})
}

//修改连接获取id
exports.emitlink = function(req,res){
	res.render("Backstage/emitlink",{
		id:req.query.id
	})
}
//修改连接执行
exports.doemitlink = function(req,res){
	
	var linkname = req.query.linkname;
	var linkaddress = req.query.linkaddress;
	
	var id= req.query.id;
	//修改前进行判断
	if(linkname==""){
		res.send("1")
		return
	}
	
	if(linkaddress==""){
		res.send("2")
		return
	}
	//以上都符合再查看是否有重名
	Link.findOne({
		linkname:linkname
	}).then(function(result){
		
		if(result){
			res.send("4")//用户名已存在
			return
		}
		//修改用户
		Link.update({_id:id},{linkname:linkname,linkaddress:linkaddress}).then(function(err){
	
			if(err.ok==1){
				res.json("5")//修改成功

				return
			}
			res.json("-5")
		})
	})
	
	
}

//blog首页
exports.blog = function(req,res){
	var data = {
		username:req.userinfo,
		categorys:[],
		category:req.query.category ||"",
		count:0,
		page:Number(req.query.page || 1),//默认第一页,
		users:"",
		article:"",
		links:"",
		imgages:"",
		limit:5//每页限制显示5个
	}
	
	var where = {}
	if(data.category){
		where.category = data.category
	}
	Flinfo.find().sort({_id:-1})

	.then(function(fldata){
			data.categorys = fldata
			return Link.find().sort({_id:-1})
	})
	.then(function(links){
		data.links = links
		return Article.where(where).count()//返回总文章数
	})
	.then(function(count){

			data.count = count
			data.pages = Math.ceil(data.count/data.limit)//总页数
			data.page = Math.min(data.page,data.pages)
			data.page = Math.max(data.page,1)
			var skip=(data.page-1)*data.limit//跳过几个
		//文章表中查找的 category关联分类，前台所属分类显示=> item.category.flname 结构 populate("category")
		return Article.where(where).find().limit(data.limit).skip(skip).populate("category").sort({_id:-1}) //返回依据条件where查找的分类文章
	})
	.then(function(article){
			data.article = article
			//查找所有用户
		Register.find().then(function(users){
			data.users = users
			return Img.find()
		}).then(function(allimg){
			if(allimg.length==0){
				res.render("reception/flarticle",data)
			}
			data.images = allimg[allimg.length-1].img
			res.render("reception/flarticle",data)	
		})	
			
	})
	
}
//显示每篇文章,以及评论
exports.content = function(req,res){
	var id = req.query.id;
	var data = {
		username:req.userinfo,
		categorys:[],
		category:req.query.category ||"",
		count:0,
		users:"",
		images:"",
		page:Number(req.query.page || 1),//默认第一页,
	
		limit:5//每页限制显示3个
	}
	var where = {}
	if(data.category){
		where.category = data.category
	}
	Flinfo.find().sort({_id:-1})

	.then(function(fldata){
			data.categorys = fldata
			return Article.where(where).count()//返回总文章数
	})
	.then(function(count){
			data.count = count
			data.pages = Math.ceil(data.count/data.limit)//总页数
			data.page = Math.min(data.page,data.pages)
			data.page = Math.max(data.page,1)
			var skip=(data.page-1)*data.limit//跳过几个
		//文章表中查找的 category关联分类，前台所属分类显示=> item.category.flname 结构 populate("category")
		return Article.where(where).findOne({_id:id}).limit(data.limit).skip(skip).populate("category").sort({_id:-1}) //返回依据条件where查找的分类文章
	})
	.then(function(content){
		Register.find().then(function(users){
			data.users = users
			data.content = content
			return Img.find()
		}).then(function(allimg){
			//文章页也要显示blog
			if(allimg.length==0){
				res.render("reception/content",data)
			}

			data.images = allimg[allimg.length-1].img
			res.render("reception/content",data)
		})
			
	})

}
//赞
exports.zan = function(req,res){
	var id =req.body.zan
	Article.findOne({_id:id}).then(function(content){
		content.zan++;
		content.save();
		res.send("1")
	})
}
//评论提交
exports.plpost = function(req,res){
	var id = req.body.id
	
	var pldata = {
		username:req.userinfo,
		date:new Date().toLocaleString(),
		pl:req.body.pl
	}
	Article.findOne({_id:id}).sort({_id:-1}).then(function(content){
		content.pl.push(pldata)
		return content.save()
	}).then(function(newContent){
		
		console.log( newContent)
		res.json(newContent.pl)
	})
}
