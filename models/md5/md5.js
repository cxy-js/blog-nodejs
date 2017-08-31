var crypto = require("crypto");
var md5=function (text){
	var hash = crypto.createHash("md5")
	return hash.update(text).digest("hex")
}
module.exports = md5
