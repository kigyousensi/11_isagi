#!/usr/bin/bash
CNT=$(sudo docker network ls | grep isagi-net | wc -l)
[ $CNT -eq 0 ] && sudo docker network create isagi-net
