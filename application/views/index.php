<? $this->capture('javascripts', $this->javascriptTag(BASE_URL . '/assets/js/index')) ?>

<div id="HomeScene" class="mainScene homePage">
    <div class="layoutD">
        <img src="<?= BASE_URL ?>/assets/images/city.png" class="cityLayer"/>
        <img src="<?= BASE_URL ?>/assets/images/potato.png" width="160" height="354" class="potatoLayer"/>
        <img src="<?= BASE_URL ?>/assets/images/burger_logo.png" width="544" height="500" class="burgerLayer"/>
        <img src="<?= BASE_URL ?>/assets/images/chili.png" class="chiliLayer"/>
        <div class="cloudLayer">
            <img src="<?= BASE_URL ?>/assets/images/cloud01.png" class="cloud1" />
            <img src="<?= BASE_URL ?>/assets/images/cloud02.png" class="cloud2" />
            <img src="<?= BASE_URL ?>/assets/images/cloud03.png" class="cloud3" />
        </div>
        <div class="facebookLogo">
        	<a href="#" >
            <img src="<?= BASE_URL ?>/assets/images/face_icon.png" class="faceIcon share-fb" />
            </a>
        </div>
        <div class="introText">
            <div class="introContent">
                <div class="leftBox"><div class="rightBox">
                        <span>Xây tháp Burger, ăn KFC miễn phí, cơ hội chỉ có trong hè 2013 này. Nhiệm vụ của bạn chỉ là vận dụng sự khéo léo để xây một tòa tháp thật cao từ bánh burger, vừa giải trí thật vui lại được nhận nhiều quà, nhanh tay truy cập nào.</span>
                    </div></div>
            </div>
        </div>
        <div id="mainNav">
            <ul class="mainNav">
                <li class="setRule"><a href="/the-le">Thể lệ</a></li>
                <li class="start"><a href="/play">Bắt đầu</a></li>
                <li class="topSix"><a href="/top">Top 6</a></li>
            </ul>
        </div>
    </div>
    <? if (isset($liked) && !$liked): ?>
    <div id="popupInfo" style="display: block; opacity: 1;">
        <div class="popupBox_bgn">
            <div class="popupLogo"></div>
            <div class="popupMes">Hãy like fanpage KFC để có thể chơi game này!</span></div>
        </div>
    </div>
    <? endif ?>
</div>