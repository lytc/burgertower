<div id="HomeScene" class="mainScene thelePage">
    <div class="layoutD glowBox">
        <div class="cloudLayer">
            <img src="/assets/images/cloud01.png" class="cloud1" />
            <img src="/assets/images/cloud02_1.png" class="cloud2" />
            <img src="/assets/images/cloud03.png" class="cloud3" />
        </div>
        <div class="boardInfo topSix_bgn">
            <div class="logoKFC"></div>
            <div class="content">
                <div class="fullDesc fullSix">
                    <!-- Top 6 content -->
                    <table class="tableInfo">
                        <caption></caption>
                        <thead>
                        <tr>
                            <th class="colName">Tên</th>
                            <th class="colScore">Điểm</th>
                            <th class="colTime">Thời gian</th>
                        </tr>
                        </thead>
                        <tbody>
                        <? foreach ($users as $user): ?>
                        <tr>
                            <td><?= $this->escape($user->name) ?></td>
                            <td><?= $user->score ?></td>
                            <td><?= sprintf(gmdate('H %\s i %\s s %\s', $user->play_time), 'giờ', 'phút', 'giây') ?></td>
                        </tr>
                        <? endforeach ?>
                        </tbody>
                    </table>
                </div>


            </div>
            <div class="burgerSymbol"></div>
        </div>
        <div class="facebookLogo otherPos">
            <img src="/assets/images/face_icon.png" class="faceIcon" />
        </div>
        <div id="mainNav" class="bigBox_Menu">
            <ul class="mainNav">
                <li class="setRule"><a href="/the-le">Thể lệ</a></li>
                <li class="start"><a href="/play">Bắt đầu</a></li>
                <li class="topSix current"><a href="/top">Top 6</a></li>
            </ul>
        </div>
    </div>
</div>