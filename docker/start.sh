#!/bin/sh
## ##################################
## コンテナを新規起動
## ##################################
sh start-inst-dbs.sh
sh start-inst-apps.sh
sh start-inst-web.sh
sleep 3
docker ps

