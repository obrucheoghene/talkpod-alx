#!/usr/bin/env bash

set -e

echo "Docker Building rtc-demo-server:latest image"

docker build -t rtc-demo-server:latest .

echo "rtc-demo-server:latest image build completed"
