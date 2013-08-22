<?php
ini_set('session.use_trans_sid', 1);
header('P3P:CP="IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT"');

use BurgerTower\Application;

error_reporting(E_ALL);
//ini_set('display_errors', false);


date_default_timezone_set('Asia/Ho_Chi_Minh');
define('APP_ROOT', realpath(__DIR__));
define('BASE_URL', getenv('APPLICATION_ENV') == 'development'? '' : '/tower');

$_SERVER['REQUEST_URI'] = preg_replace('/^\/tower\//', '/', $_SERVER['REQUEST_URI']);

require_once APP_ROOT . '/vendor/autoload.php';
require_once APP_ROOT . '/application/Application.php';
require_once APP_ROOT . '/application/configs/database.php';

$application = new Application(APP_ROOT . '/application');

$configFile = APP_ROOT . '/application/configs/application.php';
$application->configFromFile($configFile);

$application->run();