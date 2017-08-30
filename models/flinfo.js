var mongoose =require("mongoose")
var flinfoSchema =require("./Schema/fl")
module.exports = mongoose.model("Flinfo",flinfoSchema)