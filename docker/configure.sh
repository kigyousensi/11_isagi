#!/usr/bin/bash
################################################################################
## usage: configure.sh [ username ]
## ex	: bash configure.sh user01
##  username	コンテナを起動するユーザー。このユーザーでフォルダの権限を設定する
##		指定しない場合はスクリプトを起動したユーザーと想定する	
################################################################################

## ##########################
##  init
## ##########################
RC=0
USERNAME=$1
: ${USERNAME:=$(whoami)}
[ "x$USERNAME" = "x" ] && RC=1

## ##########################
##  main
## ##########################
if [ $RC -eq 0 ] ;then
 for I in apache 
 do
   sed -e "s/USERNAME/${USERNAME}/g" ${I}/resource/adduser.org > ${I}/resource/adduser.sh
 done
fi

## ##########################
##  end 
## ##########################
[ $RC -eq 1 ] && echo "usage: configure.sh username"
exit $RC
