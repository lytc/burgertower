<? $this->capture('javascripts', $this->javascriptTag(BASE_URL . '/assets/js/play')) ?>
<? $this->capture('javascripts', $this->javascriptTag(BASE_URL . '/assets/vendor/chipmunk')) ?>
<? $this->capture('javascripts', $this->javascriptTag(BASE_URL . '/assets/vendor/PxLoader/PxLoader.js')) ?>
<? $this->capture('javascripts', $this->javascriptTag(BASE_URL . '/assets/vendor/PxLoader/PxLoaderImage.js')) ?>
<? $this->capture('javascripts', $this->javascriptTag(BASE_URL . '/assets/vendor/pixi.js')) ?>
<?= $this->capture('javascripts', $this->javascriptTag('//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.js')) ?>
<? $this->capture('javascripts', $this->javascriptTag(BASE_URL . '/assets/js/random')) ?>
<? $this->capture('javascripts', $this->javascriptTag(BASE_URL . '/assets/js/game')) ?>

<div id="HomeScene" class="mainScene playPage">
    <div class="cloudLayer">
        <img src="<?= BASE_URL ?>/assets/images/cloud01.png" class="cloud1" />
        <img src="<?= BASE_URL ?>/assets/images/cloud02.png" class="cloud2" />
        <img src="<?= BASE_URL ?>/assets/images/cloud03.png" class="cloud3" />
    </div>
    <div class="cityLayer"></div>
    <div class="facebookLogo">
        <img src="<?= BASE_URL ?>/assets/images/face_icon.png" class="faceIcon share-fb" />
    </div>
    <div class="playElement"></div>
    <div class="layoutGame">
        <div class="colLeft">
            <div class="logoKFC">
            	<a href="<?= BASE_URL ?>/">
                	<img src="<?= BASE_URL ?>/assets/images/kfc_logo.png" width="85" height="87"/>
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
                    <li><span class="icon"><img src="<?= BASE_URL ?>/assets/images/burger/01_small.png"></span><i class="burger1">0</i></li>
                    <li><span class="icon"><img src="<?= BASE_URL ?>/assets/images/burger/02_small.png"></span><i class="burger2">0</i></li>
                    <li><span class="icon"><img src="<?= BASE_URL ?>/assets/images/burger/03_small.png"></span><i class="burger3">0</i></li>
                    <li><span class="icon"><img src="<?= BASE_URL ?>/assets/images/burger/04_small.png"></span><i class="burger4">0</i></li>
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
                <source src="<?= BASE_URL ?>/assets/music/looper.mp3" type="audio/mpeg"/>
                <source src="<?= BASE_URL ?>/assets/music/looper.ogg" type="audio/ogg"/>
                <source src="<?= BASE_URL ?>/assets/music/looper.wav" type="audio/wav"/>
                <source src="<?= BASE_URL ?>/assets/music/looper.webm" type="audio/webm"/>
                <a href="#">Your browser is not support audio!</a>
            </audio>
           	<!--- End --->
        </div>
    </div>

    <div id="play-result" class="messPopup" style="display: none">
        <div class="popupBox">
            <div class="gameOver">
                <img src="<?= BASE_URL ?>/assets/images/game-over.png" width="430" height="89" class="gameOverText" />
                <div class="overInfo">
                    <h3>Tổng số điểm của bạn là</h3>
                    <div class="numScore"></div>
                    <div class="timer">Thời gian chơi: <span class="play-time"></span></div>
                    <div class="numBurger">Xếp được <span class="num-burger"></span> burger</div>
                    <div class="saveBtn">
                        <button class="share">Chia Sẻ</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="logoKFC">
        	<a href="#">
                <img src="<?= BASE_URL ?>/assets/images/kfc_logo.png" />
            </a>
        </div>
        <div class="burgerSymbol"></div>
        <div id="mainNav" class="popupMenu">
            <ul class="mainNav">
                <li class="setRule"><a href="<?= BASE_URL ?>/the-le">Thể lệ</a></li>
                <li class="start current"><a href="<?= BASE_URL ?>/play">Chơi lại</a></li>
                <li class="topSix"><a href="<?= BASE_URL ?>/top">Top 6</a></li>
            </ul>
        </div>
    </div>

    <div id="register" class="messPopup" style="display: none">
        <div class="popupBox">
            <div class="registCont">
                <h3>Thông tin đăng ký</h3>
                <form name="regist" class="registForm">
                    <label>Email</label>
                    <input name="email" placeholder="Email" type="text" />
                    <br class="clear" />
                    <label>Địa chỉ</label>
                    <input type="text" placeholder="Address" name="address" />
                    <br class="clear" />
                    <label>Điện thoại</label>
                    <input placeholder="Phone" name="phone" />
                    <br class="clear" />
                    <button type="submit" class="registSend">Hoàn tất</button>
                </form>
            </div>
            <div class="closeBtn" onclick="$('#register').fadeOut()"></div>
        </div>
        <div class="logoKFC"></div>
        <div class="burgerSymbol"></div>
    </div>
</div>