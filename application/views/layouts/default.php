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
</head>

<body>
<div id="fb-root"></div>
<?= $this->content() ?>
<script>
    var BASE_URL = '<?= BASE_URL ?>'
        ,pageId = '<?= $pageId ?>'
        ,appId = '<?= $facebook->getAppID() ?>';
</script>
<script type="text/javascript" src="<?= BASE_URL ?>/assets/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="<?= BASE_URL ?>/assets/js/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="<?= BASE_URL ?>/assets/js/script.js?1"></script>

<?= $this->javascriptTag(BASE_URL . '/assets/js/application') ?>
<?= $this->capture('javascripts') ?>
<script>
    var pageId = '<?= $pageId ?>'
        ,appId = '<?= $facebook->getAppID() ?>';

    window.fbAsyncInit = function() {
        FB.init({
            appId: appId,
            cookie: true,
            xfbml: true,
            oauth: true
        });
        FB.Event.subscribe('auth.login', function(response) {
            window.location.reload();
        });

        FB.Event.subscribe('auth.logout', function(response) {
            window.location.reload();
        });

        if (!<?= $facebook->getUser() ?>) {
            FB.login()
        }
    };

    (function() {
        var e = document.createElement('script'); e.async = true;
        e.src = document.location.protocol +
            '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
    }());
</script>
</body>
</html>
