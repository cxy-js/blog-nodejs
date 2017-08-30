var mongoose =require("mongoose")
var linkSchema =require("./Schema/link")
module.exports = mongoose.model("Link",linkSchema)