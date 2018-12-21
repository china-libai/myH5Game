// 创建canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//全局变量
//击杀怪兽数
var monstersCaught = 0;

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
var monster = {
	speed: 256,//移动速度每秒
	image: monsterImage
};


//键盘监听
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//重置游戏（初始化英雄在中间位置，怪兽在随机位置）
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

//更新英雄位置坐标
var update = function (modifier) {
	if (38 in keysDown) { //向上键
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { //向下键
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { //向左键
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { //向右键
		hero.x += hero.speed * modifier;
	}

	//判断是否图片碰撞
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

//作画
var render = function () {
	ctx.drawImage(bgImage, 0, 0);
	ctx.drawImage(hero.image, hero.x, hero.y);
	ctx.drawImage(monster.image, monster.x, monster.y);
	console.log(hero.image.src);
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
	update(delta / 1000);
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
reset();
main();
changeHeroImage();
