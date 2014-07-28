<?php
// 时区
date_default_timezone_set('PRC');
class db_sqlite{
    //private db_path = "";
    //打开数据库 dirname(__FILE__).
    function connect_sqlite(){
        $dbPath = '../database/database.db';
        
        $dbConnet = 'sqlite:'.$dbPath;

        $conn =null;
        if(file_exists($dbPath)){
            try{
                $conn = new PDO($dbConnet);
                //$conn  = new PDO("sqlite:student.db");
                $conn->beginTransaction();
            }
            catch(PDOException $e){
                error_logger("connect database fail .Exception is".$e->getMessage());
                //echo "Exception is".$e->getMessage();
            }

            return $conn;
        }else{
            error_logger('database path is wrong');
            //exit(header('location:http://www.baidu.com/'));
        }


    }
    // 执行sql
    function query_sqlite($conn,$sql){
        $result = array();
        try {
            $sth=$conn->prepare($sql);
            $sth->execute();
            $result=$sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_logger("sql:".$sql." Exception is".$e->getMessage());
            //echo "Exception is".$e->getMessage();
        }

        return $result;
    }
 
    //获取某张表的总记录数
    function query_total($conn,$table){
        $result = 0;
        $sql = 'select count(*) as c from '.$table;
        try {
            $sth=$conn->prepare($sql);
            $sth->execute();
            $vec=$sth->fetchAll();
            //$result = $vec['0'];
            return ($vec['0']['c']);

        } catch (PDOException $e) {
            error_logger("sql:".$sql." Exception is".$e->getMessage());
            //echo "Exception is".$e->getMessage();
        }
        
        return $result;
    }
    //获取最大的id
    function query_maxid($conn,$table=''){
        $maxid = 0;
        
        try {
            $sql = 'select max(id) as maxid from '.$table;
            $sth=$conn->prepare($sql);
            $sth->execute();
            $vec=$sth->fetchAll();
            $maxid = $vec['0']['maxid'];
            return $maxid;

        } catch (PDOException $e) {
            error_logger("sql:".$sql." Exception is".$e->getMessage());
            //echo "Exception is".$e->getMessage();
        }
        
        return $maxid;
    }

    function exec_sqlite($conn,$sql){
        $count = 0;
        try {
            $conn->exec($sql);
            
            
        } catch (PDOException $e) {
            $conn->rollBack();
            error_logger("sql:".$sql." Exception is".$e->getMessage());
            //echo "Exception is".$e->getMessage();
        }
        // $conn->commit();
        return $count;
    }

    function commit_sqlite($conn){
        $conn->commit();
    }

    function close_sqlite($conn){
        $conn = null;
    }



}

class Util {
    static function create_obj($options='{}'){
        return json_decode($options);
    }
}

/*异步请求*/
class DatabaseAction{
    function _count($sql){
        sqlite_logger(' count sql '.$sql);
        $result = null;
        try {
            $db = new db_sqlite();
            $conn = $db->connect_sqlite();
            $sth=$conn->prepare($sql);
            $sth->execute();
            $vec=$sth->fetchAll();
            $result = $vec['0']['count(*)'];
            $result = intval($result);
            //return ($vec['0']['count(*)']);

        } catch (PDOException $e) {
            error_logger("sql:".$sql." Exception is".$e->getMessage());
            //echo "Exception is".$e->getMessage();
        }
        
        return $result;
    }
    function _get($sql){
        sqlite_logger(' get sql '.$sql);
        $result = null;

        try{
            $db = new db_sqlite();
            $conn = $db->connect_sqlite();
            $result = $db->query_sqlite($conn,$sql);

           
            $db->close_sqlite($conn);
            $db = null;


            if( gettype($result) == 'array' and $result[0]) {
                return $result[0];
            }else {
                return null;
            }

        }catch(Exception $e){
            //sqlite_logger('fail list result '.var_dump($array));
            return null;

        }

        
    }
    function _list($sql){
        sqlite_logger(' list sql '.$sql);
        $array = array();

        try{
            $db = new db_sqlite();
            $conn = $db->connect_sqlite();
            $array = $db->query_sqlite($conn,$sql);
            
            $db->close_sqlite($conn);
            $db = null;
            //sqlite_logger('ok list result '.var_dump($array));

        }catch(Exception $e){
            //sqlite_logger('fail list result '.var_dump($array));
            return null;

        }

        return $array;
    }
    function _update($sql){
        sqlite_logger(' update sql '.$sql);
        try{
              $db = new db_sqlite();
            $conn = $db->connect_sqlite();
            
            $db->exec_sqlite($conn,$sql);
            $db->commit_sqlite($conn);
            
            $db->close_sqlite($conn);
            $db = null;
        }
        catch(Exception $e){

            return false;
        }

        return true;
    }
    function _delete($sql){

        sqlite_logger(' delete sql '.$sql);

        try{
              $db = new db_sqlite();
            $conn = $db->connect_sqlite();
            
            $db->exec_sqlite($conn,$sql);
            $db->commit_sqlite($conn);
            
            $db->close_sqlite($conn);
            $db = null;
            
        }
        catch(Exception $e){

            return false;
        }

        return true;
    }
    function _bulkdelete($sql){

        sqlite_logger(' bulkdelete sql '.$sql);

        try{
              $db = new db_sqlite();
            $conn = $db->connect_sqlite();
            
            $db->exec_sqlite($conn,$sql);
            $db->commit_sqlite($conn);
            
            $db->close_sqlite($conn);
            $db = null;
            
        }
        catch(Exception $e){

            return false;
        }

        return true;
    }

    function _create($sql,$table){
        sqlite_logger(' create sql '.$sql);

        try{
            $db = new db_sqlite();
            $conn = $db->connect_sqlite();
            $db->exec_sqlite($conn,$sql);
               $db->commit_sqlite($conn);
               $id = $db->query_maxid($conn,$table);
            $db->close_sqlite($conn);

            $db = null;
            return $id;
            
        }catch(Exception $e){

            return null;
        }
        
    }
}

class Dao{

    function Dao(){
        $this->table = '';
        $this->_pagesize = 20;
    }
    function getSearchSql($params){
        $sql = ' where 1=1 ';
        return $sql;
    }
    function getListParams(){
        $params = json_decode('{}');
        $params->_page = $_GET['_page'];
        $params->_pagesize = $_GET['_pagesize'];
      
        return $params;
    }
    function getUpdateParams(){
        return json_decode('{}');
    }
    function getDeleteParams(){
        $record = json_decode('{}');

        $id = $_GET['id'];
        $record->id = $id;
          
        if( empty($id) ){
            $record = json_decode('{"code":500}');
            $record->message = '缺少参数id';
        }
        return $record;
    }
    function getCreateParams(){
        return json_decode('{}');
    }
    //获取批量删除ids
    function getBulkDeleteParams(){
        $record = json_decode('{}');

        $ids = $_GET['ids'];
        $record->ids = $ids;
          
        if( empty($ids) ){
            $record = json_decode('{"code":500}');
            $record->message = '缺少参数ids';
        }
        return $record;

    }
    function ajax_get(){
        $ret = json_decode('{"code":0,"message":"success"}');

        $id = $_GET['id'];

        $reuslt = $this->_get($id);
        
        if( $reuslt != null ){
            $ret->data = $reuslt;
            return json_encode($ret);
        }else{
            return '{"code":500,"message":"there are something wrong "}';
        }
    }
    function ajax_list(){
        $ret = json_decode('{"code":0,"message":"success"}');

        $params = $this->getListParams();

        $array = $this->_list($params);
        $count = $this->_count($params);
        if( gettype($array) == 'array' ){
            $ret->data = $array;
            $ret->total = $count;
            return json_encode($ret);
        }else{
            return '{"code":500,"message":"there are something wrong "}';
        }
    }
    function ajax_update(){
        $record = $this->getUpdateParams();
        if($record->code){
            return json_encode($record);
        }
        $result = $this->_update($record);
        if($result){
            return '{"code":200,"message":"success"}';
        }else{
            return '{"code":500,"message":"update 好像出错了"}';
        }
    }
    function ajax_create(){
        $record = $this->getCreateParams();
        sqlite_logger(' ajax_create '.json_encode($record));

        if($record->code){
            return json_encode($record);
        }
        $id = $this->_create($record);
        if($id){
            return '{"code":200,"message":"success","data":"'.$id.'"}';
        }else{
            return '{"code":500,"message":"create 好像出错了"}';
        }
    }
    function ajax_delete(){
        $record = $this->getDeleteParams();
        if($record->code){
            return json_encode($record);
        }
        $id = $record->id;
        $result = $this->_delete($id);
        if($result){
            return '{"code":200,"message":"success"}';
        }else{
            return '{"code":500,"message":"delete 好像出错了"}';
        }
    }
    function ajax_bulkdelete(){
        $record = $this->getBulkDeleteParams();
        if($record->code){
            return json_encode($record);
        }
        $ids = $record->ids;
        $result = $this->_bulkdelete($ids);
        if($result){
            return '{"code":200,"message":"success"}';
        }else{
            return '{"code":500,"message":"bulkdelete 好像出错了"}';
        }
    }
    //select * from keyword where messagetypes like '2,%' or messagetypes like '%,2,%' or messagetypes like '%,2';
    //待改进 $condition
    function _count($opts){
        $table = $this->table;
        $result = null;
        $condition = $this->getSearchSql($opts);
    
        $sql = "select count(*) from $table ".$condition;
        
        try{
            $actions = new DatabaseAction();
            $result = $actions->_count($sql);
            //return $result;

        }catch(Exception $e){
            return null;
        }
            
        return $result;

    }
    function _get($id){
        $result = null;
        $table = $this->table;

        $sql = "select * from $table  where id = $id ";
        try{  
       
            $actions = new DatabaseAction();
            $result = $actions->_get($sql);
            //var_dump($result)
            return $result;
        }
        catch(Exception $e){

            return $result;
        }

    }
    //待改进 $condition
    function _list($opts){
    
        $table = $this->table;
    
        $array = null;
        $condition = $this->getSearchSql($opts);
        
        $page = $opts->_page?$opts->_page:1;
        $pagesize = $opts->_pagesize?$opts->_pagesize:$this->_pagesize;
            
            
        $page = intval($page);
        $page--; 
        $pagesize = intval($pagesize);
        
        $index = $page*$pagesize;

        $limit = " limit $index,$pagesize";
        $sql = "select * from $table ".$condition." order by id desc ".$limit;
        
        
        try{
            $actions = new DatabaseAction();
            $array = $actions->_list($sql);
            return $array;

        }catch(Exception $e){
            return null;
        }
            
        return $array;

    }

    function _update($record){
        $table = $this->table;
        
        $id=$record->id ;
        $array =array();
          
        foreach ($record as $key => $value) {
            if($key == 'id'){

            }else{
                if(gettype($value) == 'integer'){
                    $array[] = "$key = $value";
                }else if(gettype($value) == 'string'){
                    $array[] = "$key = '$value'";
                }
            }   
        }
        $str = implode(',', $array);
        if($id and count($array)>0){
            $sql = "update $table set ".$str." where id = $id ";
            try{
                  
                $actions = new DatabaseAction();
                $actions->_update($sql);
            }
            catch(Exception $e){

                return false;
            }

        }else{
            return false;
        }

        return true;

    }
    function _delete($id){
        $table = $this->table;

        $sql = "delete from  $table  where id = $id ";
        try{
              
            $actions = new DatabaseAction();
            $actions->_delete($sql);
            return true;
        }
        catch(Exception $e){

            return false;
        }

    }
    //$ids string 1,2,3
    function _bulkdelete($ids){
        $table = $this->table;

        $sql = "delete from  $table  where id  in ($ids) ";
        try{
              
            $actions = new DatabaseAction();
            $actions->_bulkdelete($sql);
            return true;
        }
        catch(Exception $e){

            return false;
        }

    }
    function _create($record){
        $id = null;
        $table = $this->table;
        
        $arr_name =array();
        $arr_value =array();
        foreach ($record as $key => $value) {
            $arr_name[] = $key;
            if(gettype($value) == 'integer'){
                $arr_value[] = $value;

            }else if(gettype($value) == 'string'){
                $arr_value[] = "'$value'";
            }
              
        }
        $str_name = implode(',', $arr_name);
        $str_value = implode(',', $arr_value);
        
        $sql = "insert into $table($str_name) values($str_value)";

        try{
            $actions = new DatabaseAction();
            $id = $actions->_create($sql,$table);
        }catch(Exception $e){

            return null;
        }

        return $id;
    }

}

// 获取url参数
function getRequest($name=''){
    $result = '';

    if($_POST[$name]){
        $result = $_POST[$name];
    }else if($_GET[$name]){
        $result = $_GET[$name];
    }

    return $result;
}
function error_logger($content){
    file_put_contents("error_log.html",date('Y-m-d H:i:s ').$content.'<br>',FILE_APPEND);
}
?>