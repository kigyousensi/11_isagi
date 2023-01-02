#!/bin/sh
## config
DIR=$(dirname $0)
BASE=$(cd $DIR/.. ; pwd -L)

DBDIR="${BASE}/dbs/db/"
CONFD="${BASE}/dbs/conf/"
SQLD="${BASE}/dbs/sql/"

## main
## SQLDにあるsqlファイルは自動で実行される
docker run -p 3306:3306 --network isagi-net --name dbs\
 -v "${DBDIR}:/var/lib/mysqlbackup"\
 -v "${CONFD}:/etc/mysql/conf.d" \
 -v "${SQLD}:/docker-entrypoint-initdb.d" \
 -e MYSQL_ROOT_PASSWORD=mysql -d mysql 


docker ps | grep dbs
#--log-driver=syslog \  うまく動作しないときはこのオプションを付けてsyslogにメッセージを出す

