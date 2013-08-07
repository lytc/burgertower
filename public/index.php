<?php
use BurgerTower\Application;

date_default_timezone_set('Asia/Ho_Chi_Minh');
define('APP_ROOT', realpath(__DIR__ . '/../'));

require_once APP_ROOT . '/vendor/autoload.php';
require_once APP_ROOT . '/application/Application.php';
require_once APP_ROOT . '/application/configs/database.php';

$application = new Application(APP_ROOT . '/application');

$configFile = APP_ROOT . '/application/configs/application.php';
$application->configFromFile($configFile);

$application->run();