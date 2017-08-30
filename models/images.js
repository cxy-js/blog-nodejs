var mongoose =require("mongoose")
var imagesSchema =require("./Schema/images")
module.exports = mongoose.model("Images",imagesSchema)