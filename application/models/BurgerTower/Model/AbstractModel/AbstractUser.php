<?php
namespace BurgerTower\Model\AbstractModel;

/**
 * @property int id
 * @property bigint facebookId
 * @property varchar name
 * @property varchar email
 * @property varchar phone
 * @property varchar address
 * @property int potentialHackCount
 * @property int score
 * @property int playTime
 * @property datetime createdTime
 * @property timestamp modifiedTime
 * @property \Lazy\Db\Collection Scores
 */
abstract class AbstractUser extends BurgerTowerAbstractModel
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
        'facebook_id' => array(
            'type'      => self::TYPE_BIGINT,
            'length'    => 20,
            'unsigned'  => true,
            'default'   => null,
            'nullable'  => false,
        ),
        'name' => array(
            'type'      => self::TYPE_VARCHAR,
            'length'    => 255,
            'default'   => null,
            'nullable'  => false,
        ),
        'email' => array(
            'type'      => self::TYPE_VARCHAR,
            'length'    => 255,
            'default'   => null,
            'nullable'  => true,
        ),
        'phone' => array(
            'type'      => self::TYPE_VARCHAR,
            'length'    => 255,
            'default'   => null,
            'nullable'  => true,
        ),
        'address' => array(
            'type'      => self::TYPE_VARCHAR,
            'length'    => 255,
            'default'   => null,
            'nullable'  => true,
        ),
        'potential_hack_count' => array(
            'type'      => self::TYPE_INT,
            'length'    => 11,
            'default'   => '0',
            'nullable'  => false,
        ),
        'score' => array(
            'type'      => self::TYPE_INT,
            'length'    => 11,
            'default'   => null,
            'nullable'  => true,
        ),
        'play_time' => array(
            'type'      => self::TYPE_INT,
            'length'    => 11,
            'default'   => null,
            'nullable'  => true,
        ),
        'created_time' => array(
            'type'      => self::TYPE_DATETIME,
            'length'    => 11,
            'default'   => null,
            'nullable'  => false,
        ),
        'modified_time' => array(
            'type'      => self::TYPE_TIMESTAMP,
            'length'    => 11,
            'default'   => 'CURRENT_TIMESTAMP',
            'nullable'  => false,
        ),
    );

    protected static $oneToMany = array(
        'Scores' => array(
            'model'     => 'BurgerTower\Model\\Score',
            'key'       => 'user_id',
        ),
    );

}