#!/bin/sh

set -e

if [ "$LOCAL_IP_ADDRESS" = "" ]; then
  LOCAL_IP_ADDRESS="$(ip route 2>/dev/null | awk '/default/ { print $9 }')"
fi
if [ "$LOCAL_IP_ADDRESS" = "" ]; then
  echo "LOCAL_IP_ADDRESS is not set" >&2
  exit 1
fi
sed -i "s|LOCAL_IP_ADDRESS|$LOCAL_IP_ADDRESS|g" /etc/dnsmasq.conf
exec dnsmasq --no-daemon
