$(function() {
    var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=http://www.facebook.com/' + pageId + '&sk=app_' + appId

    $('.share-fb').click(function(e) {
        e.preventDefault()
        window.open(
            shareUrl,
            'facebook-share-dialog',
            'width=626,height=436');
    })
})