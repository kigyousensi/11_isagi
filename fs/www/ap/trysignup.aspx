<?php
// 一般ユーザー向けサインアップ
//
// ///////////////
// init
// ///////////////
// # require
require_once "lib/file.php";
require_once "lib/filesq.php";
require_once "lib/json.php";
require_once "lib/mysql_ph.php";
require_once "lib/unescape.php";
require_once "conf/encript.php";
require_once "conf/servers.php";

// # session
ini_set('display_errors',1); //0:エラーを非表示 1:エラーを表示

// # define
$flg=0;

// # recv
$RECV['adr']=$_POST['adr'];
$RECV['pwd']=$_POST['pwd'];

$RECV['adr']="ajt@a6.jp";
$RECV['pwd']="password@1";

// check
if(empty($RECV['adr'])){$flg=1;}   //メールアドレスチェック
if(empty($RECV['pwd'])){$flg=1;}   //パスワードチェック

// ///////////////
// preprocess
// ///////////////
// メールアドレスとパスワードからアカウント情報を作成
/// パスワードをそのまま保存するのは良くないのでソルトを付けてハッシュ化する。
/// 後でWebサービスで使えるようにトークンも発行する。トークンはメールアドレスとは関係ない乱数を使用。
/// デフォルトの表示名はメールアドレスのドメイン以外の部分から作成する。(最大16文字)。
$pass=password_hash($SOLT.$RECV['pwd'],PASSWORD_DEFAULT);// # パスワードからハッシュを作成
$token=bin2hex(random_bytes(12));                   // # トークンを作成
$dumy=explode("@",$RECV['adr']); $name=$dumy[0];    // # メールアドレスのアカウント部分から仮表示名を作成(最大16文字)
if(mb_strlen($name)>16){$name=substr($name,0,16);}  

// # アカウントIDを作成
///  アカウントIDはA00000122222の形式で作成する。
///    A 　  :ustyp 一般ユーザーと保険会社、法人を区別するために使用する。
///    00000 :usof 1001〜99000までカウントアップ。99000になったら1001に戻してustypをカウントアップ
///    1     :usck usnoのチェック・ディジット(mod9)
///  　22222 :usno 1001〜99000までカウントアップ。99000になったら1001に戻してusofをカウントアップ
///  　
///  usnoとusofで約90臆人カバーできるため基本的に足りなくなることは無いはずだが念の為A〜Cを一般ユーザーに割り当てる。
///  　ustypをカウントアップする際は設計の見直しが必要になる可能性が有るのでワーニングを出力しておく。
///  アカウントID要素のカウントアップはRDBMSでは扱いづらいためmemcached、KeyValue、またはファイルに保存する。
///    データストアの差異を吸収するため順序クラスを別途作成する。(cFileSq)

if($flg == 0){
    // アカントID要素
     $usid=""; $ustyp="A"; $usof=0;$usck=0;$usno=0;
     
    // アカウントID要素の初期値と最大値
    $aUstyp["def"]="A"; $aUstyp["max"]="C"; 
    $aUsof["def"]=1001; $aUsof["max"]=99900;
    $aUsno["def"]=1000; $aUsno["max"]=99900;
    
    // IDの2重発行を避けるためデータストアをロックする
    $sq=new cFileSq("UserAccountSQ");           // 順序オブジェクト作成
    $usno=$sq->openlock();  //オープンロック
    
    // アカウントID要素を順序オブジェクトから取得する
    $usno=$sq->get("usno",$aUsno["def"]);      //usnoを取得
    $usck=$usno % 9;                           //usckを算出
    $usof=$sq->last("usof",$aUsof["def"]);     //usofを取得
    $ustyp=$sq->last("ustyp",$aUstyp["def"]);  //ustypeを取得

    // 必要に応じてusno,usof,ustypeをカウントアップする
    $dmy="";
    if($usno >= $aUsno["max"]){//usnoが上限に達していいたらリセットしてオバーフローをカウントアップ
        $sq->set("usno",$aUsno["def"]);
        $dmy=$sq->get("usof",$aUsof["def"]);
        if($usof >=$aUsof["max"]){ // usofが上限に達していたらリセットしてユーザータイプをカウントアップ
            $sq->set("usof",$aUsof["def"]);
            $dmy=$sq->get("ustyp",$aUstyp["def"]);
            if($ustyp >= $aUstyp["max"]){// ustypが上限に達したら何らかの対策を講じる様、ログファイルにメッセージを出す
                logger("W","system","ユーザーIDが枯渇する可能性があります。最後に作成したID:".$usid); // システム管理者にメッセージ
            }
        }
    }
    $sq->openunlock();        //オープンロックを解除
    $usid=$ustyp.str_pad($usof,5,"0",STR_PAD_LEFT).$usck.str_pad($usno,5,"0",STR_PAD_LEFT);// アカウントIDを構成
print $usid; 
}

// ///////////////
// maim
// ///////////////
if($flg == 0){
   // # アカウントIDをデータベースに登録
   $table='account';
    // XSS対策としてプレースホルダを作成してからクエリを実行する
    $db=new MysqlClass($hsvs['db1']['host'],$hsvs['db1']['db'],$hsvs['db1']['user'],$hsvs['db1']['pass']); 
    $db->Pre("insert into ".$table."(usid,token,name,mail,pass,state) values(?,?,?,AES_ENCRYPT(?,'".$ENCRYPT."'),?,true)");
    $res=$db->Run($usid,$token,$name,$RECV['adr'],$pass); 
    if(!$res){$flg=3;} // 結果に問題があればエラーをセット
}

// ///////////////
// end
// ///////////////
// # 結果を返す
// 0 : 問題なし
// 1 : メールアドレスかパスワードが入力されていない
// 2 : 欠番
// 3 : アカウント登録に失敗
$data["result"]=$flg;
$json=new Services_JSON();
print $json->encode($data);

// # 成功した場合は履歴に記録
if($flg==0){logger("I","user","signup user (".$usid." ".$RECV['adr'].")");}
else{logger("E","user","signup error user (".$usid." ".$RECV['adr'].") with cord=".$flg);}
?>
