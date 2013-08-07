<?php

use \Lazy\Db\Connection;

Connection::setDefaultConfig([
    'production' => [
        'dsn' => 'mysql:host=127.0.0.1;port=3306;dbname=burgertower',
        'username' => '',
        'password' => ''
    ],
    'development' => [
        'dsn' => 'mysql:host=127.0.0.1;port=3306;dbname=burgertower',
        'username' => 'root',
        'password' => ''
    ]
]);

Connection::setEnv(getenv('APPLICATION_ENV')?: 'production');

