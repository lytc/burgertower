$(function() {
    var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=http://www.facebook.com/' + pageId + '&sk=app_' + appId
    var shareUrl = 'http://www.facebook.com/sharer/sharer.php?p[images][0]=' + encodeURIComponent('https://www.vietbuzzad.net/tower/assets/images/coverShare.jpg') + '&p[title]=KFC+Vietnam+-++Burger+Tower&p[summary]=Xây+tháp+Burger,+ăn+KFC+miễn+phí,+cơ+hội+chỉ+có+trong+hè+2013+này.&p[url]=https://www.facebook.com/KFCVietnam/app_' + appId + '&s=100';
    $('.share-fb').click(function(e) {
        e.preventDefault()
        window.open(
            shareUrl,
            'facebook-share-dialog',
            'width=626,height=436');
    })
})