#!/bin/sh
## config
DIR=$(dirname $0)
BASE=$(cd $DIR/.. ; pwd -L)

DOCDIR="${BASE}/fs/www/web/"
CNFDIR="${BASE}/web/conf/"
LOGDIR="${BASE}/web/log/"
IMGDIR="${BASE}/fs/img/"

## main
docker run -p 8080:80 --network isagi-net --name web \
-v "${DOCDIR}:/usr/share/nginx/html" \
-v "${CNFDIR}:/etc/nginx/conf.d" \
-v "${IMGDIR}:/usr/share/nginx/html/img" \
-v "${LOGDIR}:/var/log/nginx" \
-d isagi-nginx

docker ps | grep web
#--log-driver=syslog \
