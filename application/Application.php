<?php

namespace BurgerTower;

use BurgerTower\Model\User;

class Application extends \Lazy\Application\Application
{
    protected $facebook;
    protected $user;

    public function __construct()
    {
        call_user_func_array('parent::__construct', func_get_args());

//        $this->before(function() {
//            $request = $this->request();
//            $facebook = $this->getFacebook();
//            $signedRequest = $facebook->getSignedRequest();
//
//            if (isset($signedRequest['page'])) {
//                $this->session('pageId', $signedRequest['page']['id']);
//            }
//
//            $this->view()->variables('pageId', $this->session('pageId'));
//
//            if ($request->isPost() && $request->param('signed_request')) {
//                if (!isset($signedRequest['page']['liked']) || !$signedRequest['page']['liked']) {
//                    $this->redirect('like-to-play');
//                } else {
//                    $this->redirect('index');
//                }
//            }
//
//            $this->view()->variables('facebook', $facebook);
//
//            if ($facebookId = $facebook->getUser()) {
//                $facebookProfile = $facebook->api('/' . $facebookId);
//
//                // get local user
//                $user = User::first(['facebook_id' => $facebookId]);
//
//                if (!$user) { // create if not exist
//                    $user = User::create(['facebook_id' => $facebookId])->save();
//                }
//
//                $user = $user->toArray();
//                $user['name'] = $facebookProfile['name'];
////
//                $this->view()->variables('user', $user);
//            }
//        });

        $this->before(function() {
            $this->view()->variables('facebook', $this->getFacebook());
            $this->view()->variables('pageId', 1);
            $this->view()->variables('appId', 1);
            $this->view()->variables('user', ['id' => 1, 'facebook_id' => 1, 'name' => 'aa']);
        });
    }

    /**
     * @return \Facebook
     */
    public function getFacebook()
    {
        if (!$this->facebook) {
            \Facebook::$CURL_OPTS[CURLOPT_SSL_VERIFYPEER] = false;
            $facebookConfig = $this->config('facebook');
            $this->facebook = new \Facebook($facebookConfig);
        }

        return $this->facebook;
    }
}