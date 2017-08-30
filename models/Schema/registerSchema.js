var mongoose =require("mongoose")

//创建表数据结构
module.exports = new mongoose.Schema({
	username:String,
	password:String,
	date:String
})
