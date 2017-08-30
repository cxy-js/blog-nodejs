var mongoose =require("mongoose")
var articleSchema =require("./Schema/article")
module.exports = mongoose.model("Content",articleSchema)