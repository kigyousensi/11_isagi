<?php
// 一般ユーザー向けサインアップ時のメール重複チェック
//
// signup画面でメールアドレスが変更された際にこのプログラムが起動される。
// メールアドレスが空白の場合は起動されない。
// 戻り値
// data["result"]=0 ; メールアドレスが登録されていない
// data["result"]=1 ; 既に同じアドレスが登録されている
// ///////////////
// init
// ///////////////
// # require
require_once "lib/file.php";
require_once "lib/json.php";
require_once "lib/mysql_ph.php";
require_once "conf/encript.php";
require_once "conf/servers.php";

// # session
ini_set('display_errors',1); //0:エラーを非表示 1:エラーを表示

// # define
$flg=0;
$RECV['adr']=$_POST['adr'];         // # recv
if(empty($RECV['adr'])){$flg=1;}    //メールアドレスチェック

// ///////////////
// preprocess
// ///////////////

if($flg == 0){
 }

// ///////////////
// maim
// ///////////////
if($flg == 0){
    $table='account';
    // XSS対策としてプレースホルダを作成してからクエリを実行する
    $db=new MysqlClass($hsvs['db1']['host'],$hsvs['db1']['db'],$hsvs['db1']['user'],$hsvs['db1']['pass']); 
    $db->Pre("select mail from ".$table." where mail=AES_ENCRYPT(?,'".$ENCRYPT."')");
    $res=$db->Run($RECV['adr']); 
    if($res === NULL){$flg = 0;}else{$flg = 1;}
}

// ///////////////
// end
// ///////////////
// # 結果を返す
// 0 : 問題なし
// 1 : メールアドレスが入力されていないか既にメールアドレスが存在する

$data["result"]=$flg;
$json=new Services_JSON();
print $json->encode($data);
?>
