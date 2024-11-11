FROM docker.io/debian:bookworm-slim

COPY docker/dns/dnsmasq.conf /etc/dnsmasq.conf
COPY docker/dns/entrypoint.sh /usr/local/bin/entrypoint
RUN apt-get update && apt-get install -y --no-install-recommends \
    dnsmasq-base \
    iproute2 && \
    rm -rf /var/lib/apt/lists/* && \
    chmod +x /usr/local/bin/entrypoint

EXPOSE 53/udp

ENTRYPOINT ["/usr/local/bin/entrypoint"]
