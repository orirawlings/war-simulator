#! /usr/bin/env sh

basedir=`dirname $0`
python2.7 ${basedir}/battlesVsTime.py | awk -F, '{sum+=$2} END {OFMT="%d"; print sum}'
