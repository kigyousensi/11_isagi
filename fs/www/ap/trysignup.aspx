<?php
// 一般ユーザー向けサインアップ
// ///////////////
// init
// ///////////////
// # require
require "lib/file.php";
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

// # トークンを作成
$token=bin2hex(random_bytes(12));

// # メールアドレスのアカウント部分から仮アカウントを作成
$dumy=explode("@",$_POST['adr']);
$name=$dumy[0];

// # アカウントIDを作成
 // accountdb.account_countのロックを取得
 $idname=mt_rand(100,999);
 $lockname="tmp/trysignup.lock";
 $rockresult=flk($lockname,$idname);
 if($rockresult==1){$flg=3;}

 // アカウント順序から順序を取り出し、次の順序をセットする
 if($flg == 0){
 }

 // accountdb.account_countのロックを解除
 if($flg == 0){fulk($lockname);}
 
 // アカウントIDを構成
$usid="";

fad("log/log.txt",$name." ".$token,"\n");

// ///////////////
// maim
// ///////////////
if($flg == 0){
   // # アカウントIDをデータベースに登録
    // DBハンドラを作成
    //$db=new MysqlClass($hsvs['db1']['host'],$hsvs['db1']['db'],$hsvs['db1']['user'],$hsvs['db1']['pass']);
    // # プレースホルダーを作成
    //$db->Pre("insert into ".$table." (usid,token,name,mail,pass,state) values(?,?,AES_ENCRYPT(?,'".$ENCRYPT."'),?,true);
    // # 実行
    //$data=$db->Run(unescape($usid,$token,$name,$_POST['adr']),$pass);
    // 結果を確認してフラグをセット
}

// ///////////////
// end
// ///////////////
// # 結果を返す
$flg=1;
$data["result"]=$flg;
$json=new Services_JSON();
print $json->encode($data);

// # 成功した場合は履歴に記録
// 
?>
