# Database Backup Script (PostgreSQL)

$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_DIR = "./backups"
$BACKUP_FILE = "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory if not exists
if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR
}

Write-Host "Starting backup to $BACKUP_FILE..."

# Get connection string from .env if possible, or use variables
# Assuming DATABASE_URL is available as environment variable
# If not, you might need to parse .env
$env:PGPASSWORD = "aganitha789" # User's password from .env
pg_dump -h localhost -U gojo -d taskapp_dev -f $BACKUP_FILE

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup completed successfully."
    
    # Retention Strategy (Delete backups older than 7 days)
    Get-ChildItem $BACKUP_DIR -Filter "*.sql" | Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-7) } | Remove-Item
    Write-Host "Cleaned up old backups."
} else {
    Write-Error "Backup failed with exit code $LASTEXITCODE"
}
