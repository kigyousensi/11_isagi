#!/bin/sh
## config
DIR=$(dirname $0)
BASE=$(cd $DIR/.. ; pwd -L)

AUTHDIR="${BASE}/fs/www/auth/"
APPSDIR="${BASE}/fs/www/ap/"
IMGDIR="${BASE}/fs/img/"
SIMGDIR="${BASE}/fs/simg/"
PHPDIR="${BASE}/apps/phpconf/"
LOGDIR="${BASE}/apps/log/"

## main
docker run -p 8081:80   --network isagi-net --name apps \
-v "${AUTHDIR}:/var/www/html/auth" \
-v "${APPSDIR}:/var/www/html/aspx" \
-v "${IMGDIR}:/var/www/html/aspx/img" \
-v "${SIMGDIR}:/var/www/html/aspx/simg" \
-v "${PHPDIR}:/usr/local/etc/php/conf.d" \
-v "${LOGDIR}:/var/log/apache2" \
-d isagi-apache 

docker exec apps /usr/local/share/script/aduser.sh
docker ps | grep apps

