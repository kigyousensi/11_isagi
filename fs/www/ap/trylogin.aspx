<?php
// ///////////////
// init
// ///////////////
// # require
require "lib/json.php";

// # session
ini_set('display_errors',1); //0:エラーを非表示 1:エラーを表示
ini_set('session.gc_maxlifetime', 3*60*60 );//セッション時間を3時間に設定

// # define
$flg=0;
$table='';

// ///////////////
// preprocess
// ///////////////

// ///////////////
// maim
// ///////////////
if(flg==0){
  // query
   $db=new MysqlClass($hsvs['db1']['host'],$hsvs['db1']['db'],$hsvs['db1']['user'],$hsvs['db1']['pass']);
   $db->Pre("select ".$idtype.",pass from ".$table." where AES_DECRYPT(mail,'".$ENCRYPT."')=?");
   $data=$db->Run($_POST['eml']);
  if(password_verify($_POST['pwd'],$data[0]['pass']))
  {
    session_start();
    $_SESSION[$idtype]=$data[0][$idtype];            //DBから取得するIDをセッションに登録
    if($_POST['cls']=='o'){$_SESSION["utyp"]="o";} //ユーザー区分をセッションに登録
    if($_POST['cls']=='u'){$_SESSION["utyp"]="u";} //ユーザー区分をセッションに登録
    $flg=200;
  }
  else{$flg=401;}
}

// ///////////////
// end
// ///////////////
?>
