#!/bin/bash
: ${USID:=1000}
: ${GRID:=1000}
: ${NAME:='fennec'}

useradd -u $USID -o -m $NAME
groupmod -g $GRID $NAME
chmod -R 777 /var/www/html/auth
chmod -R 777 /var/www/html/aspx
chmod -R 777 /var/www/html/img

chown -R ${NAME}:${NAME} /var/www/html/auth
chown -R ${NAME}:${NAME} /var/www/html/aspx
chown -R ${NAME}:${NAME} /var/www/html/img
