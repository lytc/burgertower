<?php

$this->get('/', function() {
    $facebook = $this->getFacebook();
    if ($facebookId = $facebook->getUser()) {
        $user = $this->session('user');
        if (!$user || $user['facebook_id'] != $facebookId) {
            $facebookProfile = $facebook->api('/' . $facebookId);

            // get local user
            $user = User::first(['facebook_id' => $facebookId]);

            if (!$user) { // create if not exist
                $user = User::create(['facebook_id' => $facebookId, 'name' => $facebookProfile['name']])->save();
            }

            $user = $user->toArray();
            $this->view()->variables('user', $user);

            $this->session('user', $user);
        }

    }
    $this->display('index');

});

$this->post('/', function() {
    $facebook = $this->getFacebook();
    $signedRequest = $facebook->getSignedRequest();
    $liked = !isset($signedRequest['page']['liked']) || isset($signedRequest['page']['liked']) && $signedRequest['page']['liked'];
    $this->display('index', [
        'liked' => $liked
    ]);

//    if ($facebookId = $facebook->getUser()) {
//        $facebookProfile = $facebook->api('/' . $facebookId);
//
//        // get local user
//        $user = User::first(['facebook_id' => $facebookId]);
//
//        if (!$user) { // create if not exist
//            $user = User::create(['facebook_id' => $facebookId, 'name' => $facebookProfile['name']])->save();
//        }
//
//        $user = $user->toArray();
//        $this->view()->variables('user', $user);
//
//        $this->session('user', $user);
//    }
});