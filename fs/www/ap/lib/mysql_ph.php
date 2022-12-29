<?php
//
// MySQL用関数(プレースフォルダ有り）
// 使い方
// require 'mysql_ph.php';
// $db=new MysqlClass("host","Database","user","password"); //接続情報を設定
// $db->Pre('select * from heya_aprts where apid=?');       //プレースホルダを作成
// if($data=$db->Run("A000000001")){処理}                   //パラメタを指定してクエリを実行
//
// 戻り値
// 正常時
//  select
//    DATA[][]形式で返す。検索結果が0件の場合はDATA=NULL (=count($DATA)=0);
//  select以外
//    DATA=TRUE / FALSE
// エラー時
//  DBに接続できない   DATA=FALSE
//  クエリに問題がある  DATA=FALSE
//
// v2018.9.6 新規作成

class MysqlClass
{
        var $host;
        var $database;
        var $user;
        var $passwd;
        var $type;

        //////////////////////////////////////////////
        // Constractor
        //メンバ定義
        //////////////////////////////////////////////
        function MysqlClass($host,$database,$user,$passwd)
        {
         $this->host=$host;
         $this->database=$database;
         $this->user=$user;
         $this->passwd=$passwd;
         $this->prepare="";
         $this->type=0;
        }

        //////////////////////////////////////////////
        // set pracehoder
        // プレースホルダを作成し、クエリのタイプを決定 type 1:select 0:other
        //////////////////////////////////////////////
        function Pre($prepare)
        {
          $this->prepare=preg_replace('/^ */','',$prepare);
          if(strtoupper(substr($this->prepare,0,6))=="SELECT"){$this->type=1;}else{$this->type=0;}
        }

        //////////////////////////////////////////////
        //Run SQL
        //////////////////////////////////////////////
        function Run()
        {  //引数を受取り
           $opts= func_get_args();
         try
         {
           //DBに接続
           $connection=new PDO("mysql:host=".$this->host.";dbname=".$this->database.";charset=utf8mb4",$this->user,$this->passwd,array(PDO::ATTR_EMULATE_PREPARES => false));
           $statement=$connection->prepare($this->prepare);

           // 実行
           // SELECT     成功:結果、失敗:FALSE、クエリのエラー:NULL、成功したが結果が0件:NULL
           // SELECT以外 成功:TRUE、失敗:FALSE、クエリのエラー:NULL
           $result=call_user_func_array(array($statement,'execute'),array($opts));

           //select
           if($this->type==1){while($row=$statement->fetch(PDO::FETCH_ASSOC)){$DATA[]=$row;}}
           //select以外 (結果がnullの場合はエラーとして扱う
           if($this->type==0){if($result == (bool)true ){$DATA=true;}else{$DATA=FALSE;}}
         }
         catch(Exception $e){$DATA=FALSE;}
         return $DATA;
        }
}
?>
