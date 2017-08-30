var fs = require("fs");
//设置端口
var obj = JSON.parse(fs.readFileSync("./public/setings.json"))
module.exports =obj