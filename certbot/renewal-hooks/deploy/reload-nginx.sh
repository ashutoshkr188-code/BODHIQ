#!/bin/sh
# This script is called by Certbot after every successful certificate renewal.
# It sends a reload signal to Nginx so the new certificate takes effect
# without a full restart (zero downtime).

echo "Certificate renewed. Reloading Nginx..."
docker exec bodhiq_nginx nginx -s reload
echo "Nginx reloaded successfully."
