#!/bin/bash
# Database Backup Script (PostgreSQL) - WSL/Linux Friendly

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

echo "Starting backup to $BACKUP_FILE..."

# Set PGPASSWORD so pg_dump doesn't prompt
export PGPASSWORD="aganitha789"

pg_dump -h localhost -U gojo -d taskapp_dev -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup completed successfully."
    
    # Retention Strategy (Delete backups older than 7 days)
    find "$BACKUP_DIR" -name "*.sql" -type f -mtime +7 -delete
    echo "Cleaned up old backups."
else
    echo "Backup failed!" >&2
    exit 1
fi
