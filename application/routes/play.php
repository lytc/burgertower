<?php

use BurgerTower\Model\User;
use BurgerTower\Model\Score;

$this->requireSignIn();

$this->get('/', function() {
    $this->display('play');
});

$this->post('/start', function() {
    $this->session('gameData', [
        'startTime' => time(),
        'burgers' => 0,
        'score' => 0,
        'win' => 0,
        'loose' => 0,
    ]);
});

$this->post('/update', function() {
    $gameData = $this->session('gameData');

    $newBurger = (int) $this->param('new');
    if ($newBurger) {
        $gameData['burgers']++;
    } else if ($loose = (int) $this->param('loose')) {
        $gameData['loose']++;
    } else {
        $score = (int) $this->param('score');
        if ($score > 0 && $score <= 5) {
            $lastUpdateScoreTime = $this->session('lastUpdateScoreTime');
            $time = time();

            if ($lastUpdateScoreTime && ($time - $lastUpdateScoreTime) > .25) {
                $gameData['win']++;
                $gameData['score'] += $score;
            }
            $this->session('lastUpdateScoreTime', $time);
        }
    }

    $this->session('gameData', $gameData);
});

$this->post('/end', function() {
    $gameData = $this->session('gameData');
    $playTime = time() - $gameData['startTime'];

    $valid = true;
    # validate data
//    if ($gameData['burgers'] != ($gameData['win'] + $gameData['loose'])) {
//        $valid = false;
//    } else
    if ($gameData['win'] * 5 < $gameData['score']) {
        $valid = false;
    }

    $userId = $this->session('user')['id'];
    $user = User::first($userId);

    $newHighScore = false;

    if ($valid) {
        $connection = Score::getConnection();
        $connection->beginTransaction();
        try {
            Score::create([
                'user_id'   => $userId,
                'score'     => $gameData['score'],
                'play_time' => $playTime,
                'ip'        => $this->request()->clientIp()
            ])->save();

            if ($user->score < $gameData['score'] || ($user->score == $gameData['score'] && $user->playTime > $playTime)) {
                $user->score = $gameData['score'];
                $user->playTime = $playTime;
                $user->save();
                $newHighScore = $gameData['score'];
            }

            $connection->commit();
        } catch (\Exception $e) {
            $connection->rollBack();
        }


    } else {
        $user->potentialHackCount++;
        $user->save();
    }

    $this->session('gameData', null);

    return ['time' => $playTime, 'registered' => !!$user->email, 'score' => $gameData['score']];
});