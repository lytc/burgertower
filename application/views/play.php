<? $this->capture('javascripts', $this->javascriptTag('/assets/js/play')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/vendor/chipmunk')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/vendor/PxLoader/PxLoader.js')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/vendor/PxLoader/PxLoaderImage.js')) ?>
<? $this->capture('javascripts', $this->javascriptTag('/assets/vendor/pixi.dev.js')) ?>
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
            <div class="logoKFC">
            	<a href="#">
                	<img src="/assets/images/kfc_logo.png" width="85" height="87"/>
                </a>
            </div>
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
            </div>
            
            <!---- Audio Embedded --->
            <div id="sound" class="soundControl stop">
            	<button class="soundBtn">Play</button>
            </div>
            <audio id="mainSound" loop="loop" autoplay>
                <source src="/assets/music/looper.mp3" type="audio/mpeg"/>
                <source src="/assets/music/looper.ogg" type="audio/ogg"/>
                <source src="/assets/music/looper.wav" type="audio/wav"/>
                <source src="/assets/music/looper.webm" type="audio/webm"/>
                <a href="#">Your browser is not support audio!</a>
            </audio>
           	<!--- End --->
        </div>
    </div>

    <div id="messPopup" style="display: none">
        <div class="popupBox">
            <div class="gameOver">
                <img src="/assets/images/game-over.png" width="430" height="89" class="gameOverText" />
                <div class="overInfo">
                    <h3>Tổng số điểm của bạn là</h3>
                    <div class="numScore"></div>
                    <div class="timer">Thời gian chơi: <span class="play-time"></span></div>
                    <div class="numBurger">Xếp được <span class="num-burger"></span> burger</div>
<!--                    <div class="saveBtn">-->
<!--                        <button>Lưu Điểm</button>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
        <div class="logoKFC">
        	<a href="#">
                <img src="/assets/images/kfc_logo.png" />
            </a>
        </div>
        <div class="burgerSymbol"></div>
        <div id="mainNav" class="popupMenu">
            <ul class="mainNav">
                <li class="setRule current"><a href="/the-le">Thể lệ</a></li>
                <li class="start"><a href="/play">Chơi lại</a></li>
                <li class="topSix"><a href="/top">Top 6</a></li>
            </ul>
        </div>
    </div>
</div>