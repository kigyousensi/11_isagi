#!/usr/bin/bash
## ##########################
##  init
## ##########################
RC=0
USERNAME=$1
[ "x$USERNAME" = "x" ] && RC=1

## ##########################
##  main
## ##########################
if [ $RC -eq 0 ] ;then
 for I in apache 
 do
   sed -e "s/USERNAME/${USERNAME}/g" ${I}/resource/aduser.org > ${I}/resource/adduser.sh
 done
fi

## ##########################
##  end 
## ##########################
[ $RC -eq 1 ] && echo "usage: configure.sh username"
exit $RC
A
A
exit 1
