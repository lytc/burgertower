<?php
use BurgerTower\Model\User;

$this->post('/', function() {
    $userId = $this->session('user')['id'];
    $user = User::first($userId);

    if ($user) {
        $user->email = $this->param('email');
        $user->address = $this->param('address');
        $user->phone = $this->param('phone');
        $user->save();
    }
});