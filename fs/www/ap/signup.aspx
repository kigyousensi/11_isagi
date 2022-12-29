<?php
// 一般ユーザー向けサインアップ
// ///////////////
// init
// ///////////////
// # require
require "lib/json.php";
require "lib/unescape.php";
require "conf/encript.php";

// # session
ini_set('display_errors',1); //0:エラーを非表示 1:エラーを表示

// # define
$flg=0;
$table='account';

if(empty($_POST['adr'])){$flg=1;}   //メールアドレスチェック
if(empty($_POST['pwd'])){$flg=2;}   //パスワードチェック

// ///////////////
// preprocess
// ///////////////
// # パスワードからハッシュを作成
$pass=password_hash($_POST['pwd'],PASSWORD_DEFAULT);
// # メールアドレスからトークンを作成
$token="";
// # メールアドレスのアカウント部分から仮アカウントを作成
$name="";
// # アカウントIDを作成
 // ロックを取得
 // grptyp=10,grpcnt=100001の現状を取得
 // accntを1インクリメントする。999900を超えたらgrpofをカウントアップしてaccntを1にリセットする
 // 新grpof,accntを上書きする
 // grptyp(11)-grpof(22)-gpcnt(333333)-accnt(444444)からチェックビット(55)を算出
 // 112233333344444455をidとして使う
usid="";


// ///////////////
// maim
// ///////////////
$db=new MysqlClass($hsvs['db1']['host'],$hsvs['db1']['db'],$hsvs['db1']['user'],$hsvs['db1']['pass']);
$db->Pre("insert into ".$table." (usid,token,name,mail,pass,state) values(?,?,AES_ENCRYPT(?,'".$ENCRYPT."'),?,true);
   $data=$db->Run(unescape($usid,$token,$name,$_POST['adr']),$pass);

// ///////////////
// end
// ///////////////
?>