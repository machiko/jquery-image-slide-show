$(function(){
    //$('.fade_pic').slideImage({width: 500, height: 200});
  });

(function($){
  $.fn.slideImage = function(options) {
    var opts = $.extend({
      imgArea: $(this),
      advise: $(this).find('.ad'),
      showIndex: 0,     // 預設要先顯示那一張
      fadeOutSpeed: 1000, // 淡出的速度
      fadeInSpeed: 1000,    // 淡入的速度
      defaultZ: 1,      // 預設的 z-index
      isHover: false, //hover 狀態
      //timer: 1000,
      speed: 1000,  // 計時器及輪播切換的速度
      width: 500, //寬
      height: 500  //高       
    }, options);
      
    var init = function() {
      // 調整大小
      opts.imgArea.width(opts.width).height(opts.height + 20).find('img').nailthumb({width:opts.width, height:opts.height});
      // 先把其它圖片的變成透明
      opts.advise.css({
        opacity: 0,
        zIndex: opts.defaultZ - 1
      }).eq(opts.showIndex).css({
        opacity: 1,
        zIndex: opts.defaultZ
      });

      tagButton();
      tagAction();
      imgHover();
      startTimer(autoClick, opts.speed);
    };

    // 組出標籤按鈕
    var tagButton = function() {
      var str = '';
      for (var i = 0; i < opts.advise.length; i++) {
        if (i == 0) {
          str += '<a href="#" class="on">';
        }
        else {
          str += '<a href="#">';  
        }
        str += (i + 1) + '</a>';
      }

      opts.imgArea.append($('<div class="control">' + str + '</div>').css('zIndex', opts.defaultZ + 1));
    };

    // 當按鈕被點選時
    var tagAction = function() {
      // 若要變成滑鼠滑入來切換時, 可以把 click 換成 mouseover
      opts.imgArea.find('.control a').on('click', function(e) {
        e.preventDefault();
        // 取得目前點擊的號碼
        opts.showIndex = $(this).text() * 1 - 1;
        fadeImage(opts.showIndex);
        // 停止計時器
        clearTimeout(opts.timer);
      }).eq(opts.showIndex).addClass('on');
    };

    var imgHover = function() {
      opts.imgArea.on('mouseenter', function() {
        opts.isHover = true;
        // 停止計時器
        clearTimeout(opts.timer);
      });
      opts.imgArea.on('mouseleave', function() {
        opts.isHover = false;
        // 啟動計時器
        startTimer(autoClick, opts.speed);
      });
    };

    var autoClick = function() {
      // 自動點擊下一個
      if (opts.isHover) return;
      opts.showIndex = (opts.showIndex + 1) % opts.imgArea.find('.control a').length;
      fadeImage(opts.showIndex);
    };

    // 顯示相對應的區域並把其它區域變成透明
    var fadeImage = function(showIndex) {
      opts.advise.eq(opts.showIndex).stop().fadeTo(opts.fadeInSpeed, 1, function() {
        if(!opts.isHover){
          // 啟動計時器
          startTimer(autoClick, opts.speed + opts.fadeInSpeed);
        }
      }).css('zIndex', opts.defaultZ).siblings('a').stop().fadeTo(opts.fadeOutSpeed, 0).css('zIndex', opts.defaultZ - 1);

      // 讓 a 加上 .on
      opts.imgArea.find('.control a').eq(opts.showIndex).addClass('on').siblings().removeClass('on');
    };

    // 啟動計時器
    var startTimer = function(autoClick, speed) {
      opts.timer = setTimeout(autoClick, speed);
    };

    init();
  };
})(jQuery);