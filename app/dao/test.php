<?php
ini_set('display_errors', 'off');
$path = dirname(__FILE__);
echo "$path";


?>

<?php
/*class Fruit {
    public static $category = "I'm fruit";
    
    static function find($class) 
    {
        $vars = get_class_vars($class) ;
        echo $vars['category'] ;
    }
}

class Apple extends Fruit {
     public static $category = "I'm Apple";
}

Apple::find("Apple");*/

$obj = new StdClass;
$obj->name = new StdClass;
$obj->name->a=22;
var_dump($obj); 
?>