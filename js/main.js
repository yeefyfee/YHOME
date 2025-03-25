var iUp = (function () {
	var t = 0,
		d = 150,
		clean = function () {
			t = 0;
		},
		up = function (e) {
			setTimeout(function () {
				$(e).addClass("up")
			}, t);
			t += d;
		},
		down = function (e) {
			$(e).removeClass("up");
		},
		toggle = function (e) {
			setTimeout(function () {
				$(e).toggleClass("up")
			}, t);
			t += d;
		};
	return {
		clean: clean,
		up: up,
		down: down,
		toggle: toggle
	}
})();

$(document).ready(function () {

	// 获取一言数据
	// 本地一言数据
	const localHitokoto = [
		{ hitokoto: "每一个人都应该明确自己的方向和位置", from: "ASYEE" },
		{ hitokoto: "生活不止眼前的苟且，还有诗和远方", from: "汪国真" },
		{ hitokoto: "愿你保持初心和善良，笑里尽是温暖与坦荡", from: "千年老妖" },
		{ hitokoto: "一个人至少拥有一个梦想，有一个理由去坚强", from: "闻一多" },
		{ hitokoto: "把喜欢的一切留在身边，把温暖的记忆藏在心间", from: "匿名" }
	];

	// 备用API列表
	const apiEndpoints = [
		'https://v1.hitokoto.cn',
		'https://international.v1.hitokoto.cn',
		'https://api.maho.cc/yiyan/'
	];

	async function fetchHitokoto() {
		let lastError = null;
		const target = document.getElementById('description');

		// 尝试所有API端点
		for (const endpoint of apiEndpoints) {
			try {
				const res = await fetch(endpoint);
				const data = await res.json();
				const text = data.hitokoto + "<br/> -「<strong>" + data.from + "</strong>」";
				target.innerHTML = text;
				
				// 5秒后获取新的一言
				setTimeout(fetchHitokoto, 5000);
				return;
			} catch (err) {
				console.error(`API ${endpoint} failed:`, err);
				lastError = err;
				continue; // 尝试下一个API
			}
		}

		// 所有API都失败时，使用本地数据
		if (lastError) {
			console.log('All APIs failed, using local data');
			const randomIndex = Math.floor(Math.random() * localHitokoto.length);
			const localData = localHitokoto[randomIndex];
			const text = localData.hitokoto + "<br/> -「<strong>" + localData.from + "</strong>」";
			target.innerHTML = text;

			// 10秒后重试API
			setTimeout(fetchHitokoto, 10000);
		}
	}

	// 初始获取一言
	fetchHitokoto();

	// 监听页面可见性变化
	document.addEventListener('visibilitychange', function() {
		if (!document.hidden) {
			fetchHitokoto();
		}
	});

	// var url = 'https://query.yahooapis.com/v1/public/yql' + 
	// '?q=' + encodeURIComponent('select * from json where url=@url') +
	// '&url=' + encodeURIComponent('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8') +
	// '&format=json&callback=?';

	/**
	 * 获取Bing壁纸
	 * 原先 YQL 已经无法提供服务了
	 * 改用 JsonBird：https://bird.ioliu.cn/
	 * 
	 */
	var $panel = $('#panel');
	var localImages = [
		'/images/510.webp',
		'/images/kj.webp'
	];
	var index = parseInt(sessionStorage.getItem("index")) || 0;

	// 设置背景图片
	function setBackground() {
		if (index >= localImages.length) {
			index = 0;
		}
		var imgUrl = localImages[index];
		$panel.css("background", "url('" + imgUrl + "') center center no-repeat #666");
		$panel.css("background-size", "cover");
		sessionStorage.setItem("index", index);
	}

	// 初始设置背景
	setBackground();

	// 每30秒切换一次背景
	setInterval(function() {
		index++;
		setBackground();
	}, 30000);

	$(".iUp").each(function (i, e) {
		iUp.up(e);
	});

	$(".js-avatar")[0].onload = function () {
		$(".js-avatar").addClass("show");
	}
});

$('.btn-mobile-menu__icon').click(function () {
	if ($('.navigation-wrapper').css('display') == "block") {
		$('.navigation-wrapper').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			$('.navigation-wrapper').toggleClass('visible animated bounceOutUp');
			$('.navigation-wrapper').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
		});
		$('.navigation-wrapper').toggleClass('animated bounceInDown animated bounceOutUp');

	} else {
		$('.navigation-wrapper').toggleClass('visible animated bounceInDown');
	}
	$('.btn-mobile-menu__icon').toggleClass('social iconfont icon-list social iconfont icon-ngleup animated fadeIn');
});
