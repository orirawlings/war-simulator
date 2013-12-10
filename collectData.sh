#! /usr/bin/env sh

basedir=$(dirname $0)

for i in $(seq ${1})
do
    node ${basedir}/war.js 
done
