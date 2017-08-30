
//聊天
var socket = io() //socket实例
if($("#websocketname").text()!=""){
		$(".websocket #websocketbtn").click(function(){
		socket.emit("info",{
			name:$("#websocketname").text(),
			content:$("#text").val()
		})
		$("#text").val("")
	})
}

//接收服务端"backMsg"事件
socket.on("backMsg",function(msg){
	console.log(msg)
	$(".websocket .ul").prepend('<li>' + '<span>'+msg.name+'</span>'+ ' : ' + msg.content + '<br/>' + '<div class="date">' + new Date().toLocaleTimeString() +'</div>'+'</li>');
	
})
//清空页面信息
$("#websocketbtn1").click(function(){
	$(".websocket .ul").text("")
})
