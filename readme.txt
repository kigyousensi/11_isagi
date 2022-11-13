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
# bash setup-image.sh // isagiのイメージファイルがまだない場合
# bash start.sh       // コンテナ起動
# bash stop.sh        // コンテナ停止
# bash reset.sh       // コンテナリセット

↓通常はこちらのパスを使う
http://localhost/:8080		webサーバのroot (fs/www/web)
http://localhost/:8080/auth/	authサーバのroot(fs/www/auth)
http://localhost/:8080/apps/	apサーバのroot(fs/www/ap)

↓nginxが停止中はこちらのパスを使う
http://localhost/:8081/auth/	authサーバのroot(fs/www/auth)
http://localhost/:8081/aspx/	apサーバのroot(fs/www/ap)

// ///////////////////////////////////////////////////
// windowsの場合
// ///////////////////////////////////////////////////


