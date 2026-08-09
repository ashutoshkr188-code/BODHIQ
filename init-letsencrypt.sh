#!/bin/bash

# --- CONFIGURATION (UPDATE THESE) ---
domains=(bodhiqwatch.com www.bodhiqwatch.com)
email="" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits
# ------------------------------------

rsa_key_size=4096
data_path="./certbot"
compose_file="docker-compose.prod.yml"

if ! [ -x "$(command -v docker-compose)" ]; then
  # Try docker compose (v2)
  if docker compose version > /dev/null 2>&1; then
      COMPOSE_CMD="docker compose -f $compose_file"
  else
      echo 'Error: docker-compose is not installed.' >&2
      exit 1
  fi
else
  COMPOSE_CMD="docker-compose -f $compose_file"
fi

# Validation check removed since placeholders are updated

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

echo "### Creating Let's Encrypt recommended TLS parameters ..."
mkdir -p "$data_path/conf"

cat > "$data_path/conf/options-ssl-nginx.conf" << 'EOF'
ssl_session_cache shared:le_nginx_SSL:10m;
ssl_session_timeout 1440m;
ssl_session_tickets off;

ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;

ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
EOF

if [ ! -f "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Generating DH parameters (this will take a while)..."
  openssl dhparam -out "$data_path/conf/ssl-dhparams.pem" 2048
fi
echo

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
$COMPOSE_CMD run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo

echo "### Starting nginx ..."
$COMPOSE_CMD up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for $domains ..."
$COMPOSE_CMD run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo

echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

$COMPOSE_CMD run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

echo "### Reloading nginx ..."
$COMPOSE_CMD exec nginx nginx -s reload
