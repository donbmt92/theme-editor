#!/bin/bash

# Configuration
QUEUE_FILE="./queue/pending_domains.txt"
LOG_FILE="./queue/processed.log"

# Check if queue file exists
if [ ! -f "$QUEUE_FILE" ]; then
    exit 0
fi

# Check if queue is empty
if [ ! -s "$QUEUE_FILE" ]; then
    exit 0
fi

# Process each domain
while IFS= read -r domain || [ -n "$domain" ]; do
    # Remove whitespace
    domain=$(echo "$domain" | xargs)
    
    if [ -z "$domain" ]; then
        continue
    fi

    echo "[$(date)] Processing domain: $domain" >> "$LOG_FILE"

    # Check if Nginx config already exists to avoid re-running overhead
    if [ -f "/etc/nginx/sites-available/$domain" ]; then
        echo "[$(date)] Config exists for $domain, skipping..." >> "$LOG_FILE"
    else
        echo "[$(date)] Adding tenant: $domain" >> "$LOG_FILE"
        
        # Run add-tenant script (must be run as root/sudo)
        # Assuming this script itself is run via sudo cron
        /bin/bash ./scripts/add-tenant.sh "$domain" >> "$LOG_FILE" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "[$(date)] Successfully added $domain" >> "$LOG_FILE"
        else
            echo "[$(date)] FAILED to add $domain" >> "$LOG_FILE"
        fi
    fi

done < "$QUEUE_FILE"

# Clear the queue file
> "$QUEUE_FILE"
