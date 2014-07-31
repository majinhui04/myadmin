<?php
session_start();
ini_set('display_errors', 'off');
/*$path = dirname(__FILE__);*/
include('../conn/db_sqlite.php');



/*文章类型*/
class ArticleTypeDao extends Dao{
    
    function ArticleTypeDao(){
        $this->table = 'article_type';
        $this->_pagesize = 10;
    }
    function getUpdateParams(){
        $record = json_decode('{}');
        
        $name = getRequest('name');
        $id = getRequest('id');
        
        $record->name =  $name?$name:'';
        $record->id = $id;
          
        if( empty($id) or empty($name)  ){
            $record = json_decode('{"code":500}');
            $record->message = 'update 参数不完整';
        }
        return $record;
    }
    function getCreateParams(){
        $record = json_decode('{}');

        $name = getRequest('name');
 
        $record->name =  $name?$name:'';
        if( empty($name) ){
            $record = json_decode('{"code":500}');
            $record->message = 'create 参数不完整';
        }
              
        return $record;
    }
}

/*
    文章

    id
    title
    content
    typeid
    istop
    isshow
    author
    publishtime
    createtime
*/
class ArticleDao extends Dao{
    
    function ArticleDao(){
        
        $this->table = 'article';
        $this->_pagesize = 10;
    }
    function getUpdateParams(){
        $record = json_decode('{}');
        
        $id = getRequest('id');
        $title = getRequest('title');
        $content = getRequest('content');
        $typeid = getRequest('typeid');
        $istop = getRequest('istop');
        $isshow = getRequest('isshow');
        $author = getRequest('author');
        $publishtime = getRequest('publishtime');
        
        //sqlite_logger("id:$id,istop:".gettype($istop)."--1---:".intval($istop));

        $record->id =  $id;
        $record->title =  isset($title)?$title:null;
        $record->content =  isset($content)?$content:null;
        $record->typeid =  !empty($typeid)?intval($typeid):null;
        $record->istop =  isset($istop)?intval($istop):null;
        $record->isshow =  isset($isshow)?intval($isshow):null;
        $record->author =  isset($author)?$author:null;
        $record->publishtime =  isset($publishtime)?$publishtime:null;

        //sqlite_logger("id:$id,istop:".isset($istop)."--222---:".$record->istop.',title:'.$record->title);
        //date('Y-m-d H:i:s');
        if( empty($id) ){
            $record = json_decode('{"code":500}');
            $record->message = 'update 参数不完整';
        }
        return $record;
    }
    function getCreateParams(){
        $record = json_decode('{}');

        $title = getRequest('title');
        $content = getRequest('content');
        $typeid = getRequest('typeid');
        $istop = getRequest('istop');
        $isshow = getRequest('isshow');
        $author = getRequest('author');
        $publishtime = getRequest('publishtime');
 
        $record->title =  $title?$title:'';
        $record->content =  $content?$content:'';
        $record->typeid =  $typeid?intval($typeid):'';
        $record->istop =  intval($istop);
        $record->isshow =  intval($isshow);
        $record->author =  $author?$author:'';
        $record->publishtime =  $publishtime?$publishtime:date('Y-m-d H:i:s');
        if( empty($title) ){
            $record = json_decode('{"code":500}');
            $record->message = 'create 参数不完整';
        }
              
        return $record;
    }
    function ajax_get(){
        $ret = json_decode('{"code":0,"message":"success"}');

        $id = $_GET['id'];

        $reuslt = $this->_get($id);
        
        if( $reuslt != null ){
        	$reuslt = json_encode($reuslt);
            $reuslt = json_decode($reuslt);
        	$opts = Util::create_obj('{"_page":1,"_pagesize":"100"}');
            $articleTypeDao = new ArticleTypeDao();
            $articleTypeList = $articleTypeDao->_list($opts);
            $reuslt->type= new StdClass;
            for($i=0; $i<count($articleTypeList);$i++){
                if($reuslt->typeid == $articleTypeList[$i]['id']){
                    $reuslt->type->id = $articleTypeList[$i]['id'];
                    $reuslt->type->name = $articleTypeList[$i]['name'];
                    break;
                }
            }
            $ret->data = $reuslt;
            return json_encode($ret);
        }else{
            return '{"code":500,"message":"there are something wrong "}';
        }
    }

    function ajax_list(){
        $opts = Util::create_obj('{"_page":1,"_pagesize":"100"}');
        $articleTypeDao = new ArticleTypeDao();
        $articleTypeList = $articleTypeDao->_list($opts);

        $ret = json_decode('{"code":0,"message":"success"}');

        $params = $this->getListParams();
        $title = getRequest('title');
        $search = $title?" where title like '%$title%' ":"";
        $order = ' istop desc,id desc ';
        $array = $this->_list($params,$search,$order);
        $count = $this->_count($params,$search);
        if( gettype($array) == 'array' ){
            $array = json_encode($array);
            $array = json_decode($array);
            foreach ($array as $key => $obj) {
                
                $obj->type= new StdClass;
                for($i=0; $i<count($articleTypeList);$i++){
                    if($obj->typeid == $articleTypeList[$i]['id']){
                        $obj->type->id = $articleTypeList[$i]['id'];
                        $obj->type->name = $articleTypeList[$i]['name'];
                        break;
                    }
                }
            }

            $ret->data = $array;
            $ret->total = $count;
            return json_encode($ret);
        }else{
            return '{"code":500,"message":"there are something wrong "}';
        }
    }
}

/*
    用户

    id
    name
    email
    cellphone
    password
*/
class UserDao extends Dao{
    
    function UserDao(){
        
        $this->table = 'user';
        $this->_pagesize = 10;
    }
    function getUpdateParams(){
        $record = json_decode('{}');
        
        $id = getRequest('id');
        $name = getRequest('name');
        $email = getRequest('email');
        $cellphone = getRequest('cellphone');
        $password = getRequest('password');
        
        $record->id = $id;
        $record->name = $name;
        $record->email = $email;
        $record->cellphone = $cellphone;
        $record->password = $password;
          
        if( empty($id) ){
            $record = json_decode('{"code":500}');
            $record->message = '参数不完整';
        }
        return $record;
    }
    function getCreateParams(){
        $record = json_decode('{}');

        $name = getRequest('name');
        $email = getRequest('email');
        $cellphone = getRequest('cellphone');
        $password = getRequest('password');

        $record->name = $name;
        $record->email = $email;
        $record->cellphone = $cellphone;
        $record->password = $password;

        if( empty($name) or empty($email) or empty($cellphone) or empty($password) ){
            $record = json_decode('{"code":500}');
            $record->message = '参数不完整';
        }
              
        return $record;
    }
    function ajax_current(){
        $ret = json_decode('{"code":0,"message":"success"}');

        if( isset($_SESSION['user_email']) ){
            $reuslt = new StdClass;
            $reuslt->id = $_SESSION['user_id'];
            $reuslt->name = $_SESSION['user_name'];
            $reuslt->email = $_SESSION['user_email'];
            $ret->data = $reuslt;
            return json_encode($ret);
        }else{
            header('HTTP/1.1 500');
            return '{"code":500,"message":""}';
        }
    }


}


/* 中转站 */
class Router{
    function dispatch(){
        /*     */
        $actionMap = array(

            'articletype.list'=>'ArticleTypeDao',
            'articletype.update'=>'ArticleTypeDao',
            'articletype.create'=>'ArticleTypeDao',
            'articletype.delete'=>'ArticleTypeDao',
            'articletype.bulkdelete'=>'ArticleTypeDao',
            'articletype.get'=>'ArticleTypeDao',

            'article.list'=>'ArticleDao',
            'article.update'=>'ArticleDao',
            'article.create'=>'ArticleDao',
            'article.delete'=>'ArticleDao',
            'article.bulkdelete'=>'ArticleDao',
            'article.get'=>'ArticleDao',

            'user.list'=>'UserDao',
            'user.update'=>'UserDao',
            'user.create'=>'UserDao',
            'user.delete'=>'UserDao',
            'user.bulkdelete'=>'UserDao',
            'user.get'=>'UserDao',
            'user.current'=>'UserDao',


        );
        
        $action = getRequest('__action');

        sqlite_logger( 'action:'.$action );
        //echo "string action ".$action.'<br>';
        if( $action and $actionMap[$action] ){
            $array = explode('.',$action);
            
            $_target = $array[0];
            $_action = $array[1];

            $_dao = $actionMap[$action];
            $_run = 'ajax_'.$_action;

            $dao = new $_dao();
            // var_dump($dao);
            // echo $dao->ajax_list();
            $ret = $dao->$_run();
            echo $ret;
            //exit();

            
        }else{
            header('HTTP/1.1 404 Not Found');
            echo '{"code":404,"message":"缺失参数__action"}';
        }
    }
}
    
$router = new Router();
$router->dispatch();





function test0(){
    $sql = "update image set picurl = 'http://mmbiz.qpic.cn/mmbiz/veD11cgRBcnQnxVshoP21fAF5pTMCicRdPuEozLVr88OX4Q3YFVaAicASdTOD4Fx5cw0s5ybALKMcbJHoT3QULbA/0',mediaid = 'gRwaHXoqXkoHnTFjdnKdPR3bkFrh64eo-Pk2BOg9_Ldy8Q0d_7S0gDX5YEwocggv',articletype = 'joke',notes='11222' where id = 22";

    $db = new db_sqlite();
    $conn = $db->connect_sqlite();
    $result1 = $db->exec_sqlite($conn,$sql);
    $result2 = $db->commit_sqlite($conn);
    $db->close_sqlite($conn);
    echo '<br>'."result1:".$result1.'<br>';
    echo "result2:".$result2.'<br>';
    return true;
}
function test1(){
    $sql = "insert into about(author,notes) values('mjh','22')";

    $db = new db_sqlite();
    $conn = $db->connect_sqlite();
    $result1 = $db->exec_sqlite($conn,$sql);
    $result2 = $db->commit_sqlite($conn);
    $db->close_sqlite($conn);
    echo "$result1:".$result1.'<br>';
    echo "$result2:".$result2.'<br>';
    return true;
}
function test2(){
    
    $db = new db_sqlite();
    $conn = $db->connect_sqlite();
    $result = $db->query_maxid($conn,'about');

    $db->close_sqlite($conn);
    echo "$result:".$result.'<br>';
    
    return true;
}


?>