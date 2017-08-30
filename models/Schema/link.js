var mongoose =require("mongoose")

//创建表数据结构
module.exports = new mongoose.Schema({
	
	linkname:String,
	linkaddress:String
})
