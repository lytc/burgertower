<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta property="fb:app_id" content="<?= $facebook->getAppID() ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.facebook.com/justfortestingst/app_<?= $facebook->getAppID() ?>/" />
    <meta property="og:description" content="Xây tháp Burger, ăn KFC miễn phí, cơ hội chỉ có trong hè 2013 này." />
    <meta property="og:image" content="http://www.vietbuzzad.net/tower/assets/images/coverShare.jpg" />
    <title>KFC Vietnam - Burger Tower</title>
    <link rel="stylesheet" type="text/css" href="<?= BASE_URL ?>/assets/css/main_style.css?1"/>
    <link rel="stylesheet" type="text/css" href="<?= BASE_URL ?>/assets/css/animate.css?1"/>

    <?= $this->capture('stylesheets') ?>
    <script>
        function isIE () {
            var myNav = navigator.userAgent.toLowerCase();
            return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
        }

        if (isIE() < 9) {
            alert("Trình duyệt bạn đã cũ. Xin vui lòng nâng cấp phiên bản mới hơn để có thể chơi trò chơi này!");
        }
    </script>
    <script>
        var BASE_URL = '<?= BASE_URL ?>'
            ,pageId = '<?= $pageId ?>'
            ,appId = '<?= $facebook->getAppID() ?>';
    </script>
    <script>
        var pageId = '<?= $pageId ?>'
            ,appId = '<?= $facebook->getAppID() ?>';

        window.fbAsyncInit = function() {
            FB.init({
                appId: appId,
                channelUrl: '//www.vietbuzzad.net/tower/channel.php',
                cookie: true,
                xfbml: false,
                oauth: true,
                status: true
            });
            FB.Event.subscribe('auth.login', function(response) {
                window.location.reload();
            });

            FB.Event.subscribe('auth.logout', function(response) {
                window.location.reload();
            });

            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token
                    // and signed request each expire
//                var uid = response.authResponse.userID;
//                var accessToken = response.authResponse.accessToken;
//                $.post(BASE_URL + '/auth', {uid: uid, accessToken: accessToken})
                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook,
                    // but has not authenticated your app
                } else {
                    FB.login(function(response) {}, {scope: 'email'})
                    // the user isn't logged in to Facebook.
                }
            });
        };
    </script>
</head>

<body>
<?= $this->content() ?>
<script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script>
<script type="text/javascript" src="<?= BASE_URL ?>/assets/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="<?= BASE_URL ?>/assets/js/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="<?= BASE_URL ?>/assets/js/script.js?1"></script>

<?= $this->javascriptTag(BASE_URL . '/assets/js/application') ?>
<?= $this->capture('javascripts') ?>
</body>
</html>
