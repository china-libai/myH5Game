// 创建canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//全局变量
//击杀怪兽数
var monstersCaught = 0;
//怪兽总数量
var monsterNum = 5;


//加载图片
//背景图
var bgImage = new Image();
bgImage.src = "images/background.png";
//英雄图1
var heroImage1 = new Image();
heroImage1.src = "images/hero1.png";
//英雄图2
var heroImage2 = new Image();
heroImage2.src = "images/hero2.png";
//怪兽图片
var monsterImage = new Image();
monsterImage.src = "images/monster.png";
//英雄图片数组
var heroImageArray = [heroImage1,heroImage2];
//英雄当前图片数组位置heroA
var heroA = 0;

//游戏对象
//英雄
var hero = {
	speed: 256,//移动速度每秒
	image: heroImage1
};
//怪兽
var monsterDef = {
	speed: 200,//移动速度每秒
	image: monsterImage,//图片
	isKilled: true,//是否被杀死
	changeDate: Date.now(),//上一次移动时间
	XStatus: 1,//x轴的移动方向标记
	YStatus: 1 //y轴的移动方向标记
};
//怪兽数组
var monsterArray = new Array();

//键盘监听
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//初始化游戏（初始化英雄在中间位置，怪兽在随机位置）
var init = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	for(var i=0;i<monsterNum;i++){
		var monster = {};
		monster.XStatus = monsterDef.XStatus;
		monster.YStatus = monsterDef.YStatus;
		monster.speed = monsterDef.speed + Math.random()*20;
		monster.image = monsterDef.image;
		monster.isKilled = false;
		monster.changeDate = monsterDef.changeDate;
		monster.x = 32 + (Math.random() * (canvas.width - 64));
		monster.y = 32 + (Math.random() * (canvas.height - 64));
		monsterArray[i]=monster;
	}
};

//更新英雄位置坐标
var updateHeroXY = function (modifier) {
	if (38 in keysDown) { //向上键
		hero.y -= hero.speed * modifier;
		if(hero.y < 0){
			hero.y = 0;
		}
	}
	if (40 in keysDown) { //向下键
		hero.y += hero.speed * modifier;
		if(hero.y > canvas.height-32){
			hero.y = canvas.height-32;
		}
	}
	if (37 in keysDown) { //向左键
		hero.x -= hero.speed * modifier;
		if(hero.x < 0){
			hero.x = 0;
		}
	}
	if (39 in keysDown) { //向右键
		hero.x += hero.speed * modifier;
		if(hero.x > canvas.width-32){
			hero.x = canvas.width-32;
		}
	}

	//判断是否图片碰撞
	for(var i=0;i<monsterArray.length;i++){
		var monster = monsterArray[i];
		if (
			hero.x <= (monster.x + 32)
			&& monster.x <= (hero.x + 32)
			&& hero.y <= (monster.y + 32)
			&& monster.y <= (hero.y + 32)
		) {
			++monstersCaught;
			monster.isKilled = true;
		}
	}
	
};

//更新怪兽位置坐标
var updateMonsterXY = function(){
	for(var i=0;i<monsterArray.length;i++){
		var monster = monsterArray[i];
		if(monster.isKilled){
			var monster = {};
			monster.XStatus = monsterDef.XStatus;
			monster.YStatus = monsterDef.YStatus;
			monster.speed = monsterDef.speed + Math.random()*20;
			monster.image = monsterDef.image;
			monster.isKilled = false;
			monster.changeDate = monsterDef.changeDate;
			monster.x = 32 + (Math.random() * (canvas.width - 64));
			monster.y = 32 + (Math.random() * (canvas.height - 64));
			monsterArray[i]=monster;
		}else{
			var now = Date.now();
			var runTime = (now - monster.changeDate)/1000;
			if(monster.XStatus == 1){
				monster.x = monster.x + monster.speed*runTime;
			}else{
				monster.x = monster.x - monster.speed*runTime;
			}
			if(monster.x<0 || monster.x > canvas.width-32){
				if(monster.x<0){
					monster.x = 0
				}else{
					monster.x = canvas.width-32	
				}
				monster.XStatus = monster.XStatus * -1;
			}
			
			if(monster.YStatus == 1){
				monster.y = monster.y + monster.speed*runTime;
			}else{
				monster.y = monster.y - monster.speed*runTime;
			}
			if(monster.y<0 || monster.y > canvas.height-32){
				if(monster.y<0){
					monster.y = 0
				}else{
					monster.y = canvas.height-32;
				}
				monster.YStatus = monster.YStatus * -1;
			}
			monster.changeDate = now;
		}
		
	}
	requestAnimationFrame(updateMonsterXY);
};

//作画
var render = function () {
	ctx.drawImage(bgImage, 0, 0);
	ctx.drawImage(hero.image, hero.x, hero.y);
	for(var i=0;i<monsterArray.length;i++){
		var monster = monsterArray[i];
		ctx.drawImage(monster.image, monster.x, monster.y);	
	}
	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("击杀怪兽数：" + monstersCaught, 32, 32);
};

//运行主方法
var main = function () {
	var now = Date.now();
	var delta = now - then;
	//更新英雄坐标
	updateHeroXY(delta / 1000);
	//作画
	render();

	then = now;
	//定时执行
	requestAnimationFrame(main);
};

//更新英雄图片
var changeHeroImage = function(){
	var now = Date.now();
	if(now - heroChangeDate > 150){//150毫秒更新一次
		hero.image = heroImageArray[heroA];
		heroA ++ ;
		if(heroA == heroImageArray.length){
			heroA = 0 ;
		}
		heroChangeDate = now;
	}
	//定时执行
	requestAnimationFrame(changeHeroImage);
}
//多个||避免浏览器兼容问题
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//开始游戏
var then = Date.now();
var heroChangeDate = Date.now();
init();
main();
changeHeroImage();
updateMonsterXY();
