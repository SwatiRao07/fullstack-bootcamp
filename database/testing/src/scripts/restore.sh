#!/bin/bash
# Database Restore Script (PostgreSQL) - WSL/Linux Friendly

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore.sh ./backups/backup_xyz.sql"
    exit 1
fi

echo "Starting restore from $BACKUP_FILE..."

# Set PGPASSWORD
export PGPASSWORD="aganitha789"

# Perform restore
psql -h localhost -U gojo -d taskapp_dev -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Restore completed successfully."
else
    echo "Restore failed!" >&2
    exit 1
fi
