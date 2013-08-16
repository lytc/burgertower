<?php

$this->get('/', function() {
    $this->display('index');

});

$this->post('/', function() {
    $signedRequest = $this->getFacebook()->getSignedRequest();
    $liked = !isset($signedRequest['page']['liked']) || isset($signedRequest['page']['liked']) && $signedRequest['page']['liked'];
    $this->display('index', [
        'liked' => $liked
    ]);
});