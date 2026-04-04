#!/bin/sh
export PORT=${PORT:-80}
export BACKEND_URL=${BACKEND_URL:-http://backend:8000}

echo "=== Template file exists? ==="
ls -la /etc/nginx/conf.d/default.conf.template || echo "Template not found!"

envsubst '${PORT} ${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "=== Generated nginx config ==="
cat /etc/nginx/conf.d/default.conf
echo "=== End of config ==="

echo "=== Starting nginx ==="
nginx -g 'daemon off;'
