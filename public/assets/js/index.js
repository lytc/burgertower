$( function() {
    $('.burgerLayer, .cloudLayer, .cityLayer, .chiliLayer, .potatoLayer, .facebookLogo, .introContent, #mainNav').css({opacity: 0}, 0);
    $('#popupInfo').hide().css({opacity: 0}, 0);

    $('.homePage').bgscroll({scrollSpeed:10, direction:'h' });
    $('.cityLayer').animate({opacity: 1}, 1200, function(){
        $('.potatoLayer').animate({opacity: 1, top: 394, left: 0}, 600, function(){
            $('.burgerLayer').animate({bottom: 100, opacity: 1}, 1500, "easeOutBounce", function(){
                $('.chiliLayer').animate({opacity: 1, left: 25}, 500, "", function(){
                    $('#mainNav').animate({opacity: 1, bottom: 30}, 400);
                });
                $('.introContent').animate({opacity: 1, width: 600}, 1000, "easeOutBounce", function(){
                    $('.cloudLayer, .facebookLogo').animate({opacity: 1}, "slow");
                });
            });
        });
    });

//    $('.faceIcon').click(function(){
//        $('#popupInfo').show().animate({opacity: 1}, 500);
//    });
});