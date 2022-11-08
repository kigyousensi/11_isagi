#!/usr/bin/bash
pushd apache
bash build-apache-master.sh
popd

pushd nginx
bash build-nginx-master.sh
popd

pushd memcached
bash build-memcached-master.sh
popd

docker images | grep isagi
