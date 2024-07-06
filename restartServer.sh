redis-cli --scan --pattern "*socket*" | sed -e 's/^/"/g' -e 's/$/"/g' | xargs -L 100 redis-cli del
pm2 restart server