#!/usr/bin/env bash

set -e

echo "Running rtc-demo-server:lastest docker image"

docker run -d \
    -p 8000:8000 \
    -p 2000-2300:2000-2300/tcp \
    -p 2000-2300:2000-2300/udp \
    -e DATABASE_URL="postgres://postgres:d3J0Y2RhdGFiYXNlaGhoampzbmRmamtuZGRkCg==@34.140.84.160:5432/mydb" \
    -e RTC_MIN_PORT=2000 \
    -e RTC_MAX_PORT=2300 \
    -e MEDIASOUP_ANNOUNCED_IP="35.239.146.95" \
    rtc-demo-server:latest
