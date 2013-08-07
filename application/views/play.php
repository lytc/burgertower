<? $this->capture('javascripts', $this->javascriptTag('/assets/js/play')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/vendor/chipmunk')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/vendor/PxLoader/PxLoader.js')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/vendor/PxLoader/PxLoaderImage.js')) ?>
<?= $this->capture('javascripts', $this->javascriptTag('//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.js')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/js/random')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/js/game')) ?>

<div id="HomeScene" class="mainScene playPage">
    <div class="cloudLayer">
        <img src="/assets/images/cloud01.png" class="cloud1" />
        <img src="/assets/images/cloud02.png" class="cloud2" />
        <img src="/assets/images/cloud03.png" class="cloud3" />
    </div>
    <div class="cityLayer"></div>
    <div class="facebookLogo">
        <img src="/assets/images/face_icon.png" class="faceIcon share-fb" />
    </div>
    <div class="playElement"></div>
    <div class="layoutGame">
        <div class="colLeft">
            <div class="logoKFC"></div>
            <div class="timming">
                <div class="numOutline">00:00:00</div>
            </div>
            <div class="totalScore">
                <div class="numOutline">0</div>
            </div>
            <div class="burgerKind">
                <ul>

                </ul>
            </div>
            <div class="memberInfo">
                <div class="accountCont">
                    <div class="thumb">
                        <img src="https://graph.facebook.com/<?= $user['facebook_id'] ?>/picture" width="180" height="180" class="thumbImg" />
                    </div>
                    <div class="accName"><span class="name"><?= $this->escape($user['name']) ?></span><span class="desc">Thành viên thứ <?= $user['id'] ?></span></div>
                </div>
            </div>
        </div>
        <div class="colRight">
            <div class="lifeNum">
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div id="playStage" class="playStage">
                <canvas id="canvas" width="588" height="614"></canvas>
            </div>
        </div>
    </div>
</div>