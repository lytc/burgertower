<?php

use Lazy\Db\Connection;
use Lazy\Db\Generator;

define('ROOT', realpath(__DIR__ . '/..'));

require_once ROOT . '/vendor/autoload.php';
require_once ROOT . '/application/configs/database.php';

Connection::setEnv('development');

$generator = new Generator(Connection::getDefaultInstance());
$generator->setDirectory(ROOT . '/application/models')
    ->setGenerateAbstractModel(true)
    ->setNamespace('BurgerTower\\Model')
    ->setRootAbstractModelClassName('BurgerTowerAbstractModel');

$generator->generate();