/*
*
*登录注册
* 
 */
//退出
$("#logout").click(function(){
	
	$.ajax({
		
		url:"/logout",
		success:function(result){
			if(result=="2"){
				window.location.reload()
			}
			
		}
	})
})
//拖拽
new Drag(".singin")
new Drag(".singin1")


/****************************/
var sing = document.querySelector(".sing")
var singin = document.querySelector(".singin")//注册框
var singin1 = document.querySelector(".singin1")//登录框
var dl = document.querySelector("#dl")//登录按钮
var zc = document.querySelector("#zc")//注册按钮
var del = document.querySelector("#del")//注册按钮右上角叉号
var del1 = document.querySelector("#del1")//登录按钮右上角叉号
var dlZc = document.getElementById('dl-zc')
var zcDl = document.getElementById('zc-dl')
var time=null,speedy=0
	
	singin.style.left=($(".main").width()-500)/2+"px"
	singin1.style.left=($(".main").width()-500)/2+"px"

//登录按钮
dl.onclick=DZ
function DZ(){
	singin.style.display="none";
	sing.style.display="none";
	singin1.style.display="block";
	clearInterval(time)
	starMove(singin1)
}

//注册按钮
zc.onclick=ZC

function ZC(){
	singin1.style.display="none";
	sing.style.display="none";
	singin.style.display="block";
	clearInterval(time)
	starMove(singin)
}
//登录注册运动函数
function starMove(obj){
	
	time=setInterval(function(){
		speedy+=0.95;
		var T=speedy+obj.offsetTop;
		var t=document.documentElement.clientHeight-obj.offsetHeight-(document.documentElement.clientHeight/3);
		//缓动系数
		if (T>t) {
			speedy*=-0.68;
			speedy*=0.95;
			speedy*=0.8
			T=t
		}
		obj.style.top=T+"px"

	},13)
}
//登录隐藏
del.onclick = function(){
	sing.style.display="block";
	
	clearInterval(time)
	singin.style.cssText="display:none"
}
//注册隐藏
del1.onclick = function(){
	sing.style.display="block";
	
	clearInterval(time)
	singin1.style.cssText="display:none;top:-10%"
}
//登录显示后点击里面的注册按钮，显示注册
dlZc.onclick = zc.onclick
//注册显示后点击里面的登录按钮，显示登录
zcDl.onclick = dl.onclick

//ajax注册
$(".btn-register").click(function(){

	$.ajax({
		type:"post",
		url:"/register",
		data:{
			username:$("#username").val(),
			password:$("#password").val(),
			repassword:$("#repassword").val()
		},
		dataType:"json",
		success:function(result){
			if(result=="1"){
				$(".reusername").text("用户名不能为空！")
				$(".reusername").show()
			
			}
			if(result=="2"){
				$(".repassword").text("密码不能为空！")
				$(".repassword").show()
				
			}
			if(result=="3"){
				$(".repassword").text("两次密码不一致！")
				$(".repassword").show()
				
			}
			if(result=="4"){
				$(".reusername").text("用户已存在！")
				$(".reusername").show()
				
			}
			
			if(result=="0"){
				//10注册成功
				//刷新页面才能显示用
			location.href="/"
			// window.location.reload()
			}

			
		}

	})
})


//ajax登录
$(".btn-login").click(function(){
	$.ajax({
		type:"post",
		url:"/login",
		data:{
			username:$("#singusername").val(),
			password:$("#singpassword").val(),
			
		},
		dataType:"json",
		success:function(result){
			if(result=="1"){
				$(".singusername").text("用户名不能为空！")
				$(".singusername").show()
			}
			if(result=="2"){
				$(".singpassword").text("密码不能为空！")
				$(".singpassword").show()
			}
			if(result=="5"){
				$(".singusername").text("用户不存在！")
				$(".singusername").show()
			}
			if(result=="6"){
				$(".singusername").text("密码错误！")
				$(".singusername").show()
			}
			if(result=="3"){
				//1登录成功
				//刷新页面
				// $(".sing").hide()
				
				window.location.reload()
			}
		}

	})
})

