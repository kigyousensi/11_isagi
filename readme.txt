// 11-isagi
// ///////////////////////////////////////////////////
// ディレクトリ構成
// ///////////////////////////////////////////////////
/fs
 + www
 |  + web	webサーバのソースコード
 |  + ap	apサーバのソースコード
 |  + auth	authサーバのソースコード
 + img		webサーバとapサーバが共通で使用するimgディレクトリ
 + simg		apサーバが使用するimgディレクトリ
/web	docker用webサーバの設定
/apps	docker用appsサーバの設定
/dbs	docker用dbsサーバの設定
/docker docker用ビルドと運用スクリプト

// ///////////////////////////////////////////////////
// ubuntuの場合
// ///////////////////////////////////////////////////

# git clone git@github.com:kigyousensi/11_isagi.git
# cd docker
# bash configure.sh
# bash setup-net.sh   // isagi-netがなければ作成される
# bash setup-image.sh // isagiのイメージファイルがまだない場合
# bash start.sh       // コンテナ起動
# bash stop.sh        // コンテナ停止
# bash reset.sh       // コンテナリセット

動作確認
 http://localhost/ 	...webのTOPページが表示されること
 http://localhost/ap/	...apのページが表示されること
 http://localhost/auth/	...authページが表示されること
 http://localhost/img/	...imgページが表示されること
 http://localhost/ap/img/	...imgページが表示されること
 http://localhost/ap/simg/	...simgページが表示されること

// ///////////////////////////////////////////////////
// windowsの場合
// ///////////////////////////////////////////////////
1) apache,php,mysqlをインストールしてapacheからphpのpdoからmysqlを使用できる環境を作っておくこと
 apache 	2.4系
 php 	7.x系
 mysql	8.0.x系以上

2) httpd.confを編集して以下のディレクティブを設定する
DocumentRootは既存の設定を編集し、AliasとDirectoryはファイルの最後に追記する。
-- 以下、変更内容
# DocumentRoot
DocumentRoot "c:/git/11_isagi/fs/www/web"

# アプリケーションサーバの仮想ディレクトリ
Alias /ap "c:/git/11_isagi/fs/www/ap" 
<Directory "c:/git/11_isagi/fs/www/web">
 Require all granted
</Directory>

# 認証サーバの仮想ディレクトリ
Alias /auth "c:/git/11_isagi/fs/www/auth" 
<Directory "c:/git/11_isagi/fs/www/auth">
 Require all granted
</Directory>

# imgファイルの仮想ディレクトリ
Alias /img "c:/git/11_isagi/fs/img" 
Alias /ap/img "c:/git/11_isagi/fs/img" 
Alias /ap/simg "c:/git/11_isagi/fs/simg" 
<Directory "c:/git/11_isagi/fs/img">
 Require all granted
</Directory>
<Directory "c:/git/11_isagi/fs/simg">
 Require all granted
</Directory>
-- 変更内容ここまで

3) apacheを再起動して動作確認
 http://localhost/ 	...webのTOPページが表示されること
 http://localhost/ap/	...apのページが表示されること
 http://localhost/auth/	...authページが表示されること
 http://localhost/img/	...imgページが表示されること
 http://localhost/ap/img/	...imgページが表示されること
 http://localhost/ap/simg/	...simgページが表示されること

4) DBサーバのホスト名を登録
　c:\windows\System32\drivers\etc/hostsに以下を追記する
  127.0.0.7	dbs

  > ping dbs
    応答が返ってくること

5) my.iniの文字コードを設定
  以下のいずれかにあるファイルを開く
  c:\windows\my.ini
  c:\windows\my.cnf
  インストールディレクトリ\my.ini
  インストールディレクトリ\my.cnf

  11_isagi/dbs/conf/mysql.cnfの内容を転記して保存

6) mysqlを起動

7) データベース作成
 > cd 11isagi\dbs\sql
 > mysql -u root -p
   インストール時に指定したパスワードを入力
 mysql> show variables like "char%";
 -> すべてutf8mb3になっていること 
 mysql> source ./setup.sql;
 -> データベースとテーブルが作られる
 mysql> show databases;
 -> accountdbとassetdbが作られていること
 mysql> use accountdb;
 mysql> show tables;
 -> accountテーブルが存在すること
 mysql> use assetdb;
 mysql> show tables;
 -> touki,asset_countテーブルが存在すること
