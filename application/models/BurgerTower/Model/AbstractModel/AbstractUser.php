<?php
namespace BurgerTower\Model\AbstractModel;

/**
 * @property int id
 * @property bigint facebookId
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
    );

    protected static $oneToMany = array(
        'Scores' => array(
            'model'     => 'BurgerTower\Model\\Score',
            'key'       => 'user_id',
        ),
    );

}