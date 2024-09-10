#!/bin/sh

IP_ADDRESS=$(ip route 2>/dev/null | awk '/default/ { print $9 }')
if [ -z "$IP_ADDRESS" ]; then
    IP_ADDRESS="$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)"
fi
if [ -z "$IP_ADDRESS" ]; then
    echo "Failed to determine IP address"
    exit 1
fi
cat dns.local | sed "s|IP_ADDRESS|$IP_ADDRESS|g" > .dns.local
sudo coredns -conf Coredns
