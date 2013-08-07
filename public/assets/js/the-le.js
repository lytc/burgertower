$( function() {
    $('.boardInfo, .facebookLogo, .burgerSymbol, .mainNav').hide().css({opacity:0},0);
    $('.thelePage').bgscroll({scrollSpeed:10, direction:'h' });

    $('.boardInfo').show().animate({opacity: 1}, 1000, function(){
        $('.burgerSymbol').show().animate({opacity: 1, bottom: -35}, 500, "easeOutBounce", function(){
            $('.mainNav').show().animate({opacity: 1}, 1000, "easeInBounce", function(){
                $('.facebookLogo').show().animate({opacity:1}, 200);
            });
        });
    });

});