FROM php:7.3-apache
## mysqlクライアントをインストールする
run apt-get update && docker-php-ext-install mysqli

## エンコードライブラリを追加する
run apt-get install libpng-dev -y
run apt-get install libjpeg-dev -y
run apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev

## phpの画像編集ライブラリ(gd)を追加する
run docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ 
run docker-php-ext-install -j$(nproc) gd

## phpにmongodbのライブラリを追加
# run apt-get install libssl-dev -y
# run pecl install mongo
# run echo "extension=mongo.so" > /usr/local/etc/php/conf.d/docker-php-mongo.ini

## PDOでMysqlに接続するためのドライバを追加する
run docker-php-ext-install pdo_mysql

##aspxをphpで動作させる
run mv -f /etc/apache2/conf-available/docker-php.conf /etc/apache2/conf-available/docker-php.conf.org
run sed '/index\.html/s/^.*$/DirectoryIndex index.php index.html index.aspx/' /etc/apache2/conf-available/docker-php.conf.org > /etc/apache2/conf-available/docker-php.conf
run echo "<FilesMatch \.aspx$>" >> /etc/apache2/conf-available/docker-php.conf
run echo "  SetHandler application/x-httpd-php" >> /etc/apache2/conf-available/docker-php.conf
run echo "</FilesMatch>" >> /etc/apache2/conf-available/docker-php.conf

##phpからmemcachdを呼び出すphp5-memcachedをインストールする
#run apt-get -y install libmemcached-dev
#run pecl install memcached

##セッション管理をmemcachedに任せる
#run echo "extension=memcached.so" > /usr/local/etc/php/conf.d/docker-php-session.ini
#run echo "session.save_handler=memcached" >> /usr/local/etc/php/conf.d/docker-php-session.ini
#run echo "session.save_path=memcached1:11211" >> /usr/local/etc/php/conf.d/docker-php-session.ini
#run echo "[memcached]\
# memcached.sess_lock_wait_min = 100;\
# memcached.sess_lock_wait_max = 1000;\
# memcached.sess_lock_retries = 30;" >> /usr/local/etc/php/conf.d/docker-php-session.ini

##web用のフォルダを作成する
run mkdir /var/www/html/auth
run mkdir /var/www/html/aspx
run mkdir /var/www/html/img

##ファイルを入れ替える
run mkdir /usr/local/share/script
copy resource/adduser.sh /usr/local/share/script/adduser.sh
run chmod 777 /usr/local/share/script/adduser.sh

##エントリーポイントのスクリプトを起動する
# CMD /bin/sh "/usr/local/share/script/adduser.sh" ←インスタンス起動時に実行


