<?php

namespace App\Faker\Provider;

use Faker\Provider\Base;
use Faker\Generator as Faker;

class EnumProvider extends Base
{
    static private $values = [];
    
    public function __construct(Faker $faker, array $values)
    {
        parent::__construct($faker);
        
        self::$values = $values;
    }
    
    static public function enum()
    {
        return array_random(self::$values);
    }

    static public function uniqueEnum()
    {
        if (empty(self::$values)) throw new \Exception('No more possible values');
        $value = self::enum();
        self::$values = array_diff(self::$values, [$value]);
        return $value;
    }
}