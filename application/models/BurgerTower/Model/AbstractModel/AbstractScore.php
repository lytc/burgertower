<?php
namespace BurgerTower\Model\AbstractModel;

/**
 * @property int id
 * @property int userId
 * @property int score
 * @property int playTime
 * @property varchar ip
 * @property datetime createdTime
 * @property timestamp modifiedTime
 * @property \BurgerTower\Model\User User
 */
abstract class AbstractScore extends BurgerTowerAbstractModel
{
    protected static $columns = array(
        'id' => array(
            'type'      => self::TYPE_INT,
            'length'    => 11,
            'unsigned'  => true,
            'default'   => null,
            'auto'      => true,
            'nullable'  => false,
        ),
        'user_id' => array(
            'type'      => self::TYPE_INT,
            'length'    => 11,
            'unsigned'  => true,
            'default'   => null,
            'nullable'  => false,
        ),
        'score' => array(
            'type'      => self::TYPE_INT,
            'length'    => 11,
            'default'   => null,
            'nullable'  => false,
        ),
        'play_time' => array(
            'type'      => self::TYPE_INT,
            'length'    => 11,
            'default'   => null,
            'nullable'  => false,
        ),
        'ip' => array(
            'type'      => self::TYPE_VARCHAR,
            'length'    => 50,
            'default'   => null,
            'nullable'  => false,
        ),
        'created_time' => array(
            'type'      => self::TYPE_DATETIME,
            'length'    => 50,
            'default'   => null,
            'nullable'  => false,
        ),
        'modified_time' => array(
            'type'      => self::TYPE_TIMESTAMP,
            'length'    => 50,
            'default'   => 'CURRENT_TIMESTAMP',
            'nullable'  => false,
        ),
    );

    protected static $manyToOne = array(
        'User' => array(
            'model'     => 'BurgerTower\Model\\User',
            'key'       => 'user_id',
        ),
    );

}