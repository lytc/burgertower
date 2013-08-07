<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>KFC Burger Home</title>
    <link rel="stylesheet" type="text/css" href="/assets/css/main_style.css"/>
    <link rel="stylesheet" type="text/css" href="/assets/css/animate.css"/>

    <?= $this->capture('stylesheets') ?>
</head>

<body>
<div id="fb-root"></div>
<?= $this->content() ?>

<script type="text/javascript" src="/assets/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="/assets/js/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="/assets/js/script.js"></script>

<?= $this->javascriptTag('/assets/js/application') ?>
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
