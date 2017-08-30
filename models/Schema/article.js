var mongoose =require("mongoose")

//创建文章表数据结构
module.exports = new mongoose.Schema({
	//关联分类字段
	category:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Flinfo"//关联flinfo.js中的“Flinfo”类==>>module.exports = mongoose.model("Flinfo",flinfoSchema)
	},
	title:String,//标题
	content:String,//内容
	author:String,//作者
	date:String,//时间
	
	//赞
	zan:{
		type:Number,
		default:0
	},
	//评论
	pl:{
		type:Array,
		default:[]
	}


})