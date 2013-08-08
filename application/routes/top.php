<?php
use BurgerTower\Model\User;

$this->get('/', function() {
    $users = User::all()->limit(6)
        ->order(['score' => 'DESC', 'play_time' => 'ASC'])
        ->where(['score IS NOT NULL', 'score > 0'])
    ;

    $this->display('top', [
        'users' => $users
    ]);
});