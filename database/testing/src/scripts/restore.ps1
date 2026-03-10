# Database Restore Script (PostgreSQL)

param (
    [string]$BackupFile
)

if (-not $BackupFile) {
    Write-Error "Please provide a backup file path: .\restore.ps1 -BackupFile ./backups/backup_xyz.sql"
    exit 1
}

Write-Host "Starting restore from $BackupFile..."

$env:PGPASSWORD = "aganitha789"

# Drop and Recreate database (Simplified: just drop and recreate public schema if authorized, 
# or run the SQL which might have drop statements)
psql -h localhost -U gojo -d taskapp_dev -f $BackupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Restore completed successfully."
} else {
    Write-Error "Restore failed with exit code $LASTEXITCODE"
}
