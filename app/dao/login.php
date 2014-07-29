<?php
    session_start();
    ini_set('display_errors', 'off');
    include('../conn/db_sqlite.php');

    $email = $_POST['email'];
    $password = $_POST['password'];


    $result = new StdClass;
    $result->email = $email;
    $result->password = $password;
    
    if( empty($password) or empty($email) ) {
        header('HTTP/1.1 500');
        echo '{"message":"账号或者密码出错"}';
        die();
    }
    $sql = "select * from user where email='$email' and password = '$password' ";
    
    try {
        $actions = new DatabaseAction();
        $ret = $actions->_list($sql);
        if( gettype($ret) == 'array' and count($ret)==1) {
            
            $result->data = $ret;

            $_SESSION['user_id'] = $ret[0]['id'];
            $_SESSION['user_name'] = $ret[0]['name'];
            $_SESSION['user_email'] = $email;
            echo json_encode($result);
        }else{
            header('HTTP/1.1 404 Not Found');
            echo '{"message":"404"}';
        }
        die();
        //return $result;

    }catch(Exception $e){
        header('HTTP/1.1 500');
        echo '{"message":"500"}';
    }
        
   

    
?>