var mongoose =require("mongoose")
var registerSchema =require("./Schema/registerSchema")
module.exports = mongoose.model("Register",registerSchema)