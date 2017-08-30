var mongoose =require("mongoose")

//创建表数据结构
module.exports = new mongoose.Schema({
	
	img:{
		type:String,
		default:"blog.png"
	}
})