# Disaster Recovery Procedures

This document outlines the strategy for backing up and restoring the `taskapp_dev` database.

## Backup Strategy

### Automated Backups

Automated backups are handled via the `src/scripts/backup.ps1` script. This script performs the following actions:

1.  Generates a timestamped SQL dump using `pg_dump`.
2.  Saves the dump to the `./backups/` directory.
3.  Implements **Rotation**: Automatically deletes backups older than 7 days to manage disk space.

**To run manually:**

```powershell
pnpm run backup
```

### Retention Policy

- **Daily**: One backup per day is generated via CI/CD or Task Scheduler.
- **Weekly**: Weekly snapshots are archived externally (manual process or cloud sync).

## Restoration Procedure

In the event of data corruption or loss, follow these steps:

1.  **Identify the Backup**: Choose the latest stable `.sql` file from the `./backups/` directory.
2.  **Verify Integrity**: Ensure the backup file is not empty and contains valid SQL statements.
3.  **Perform Restore**: Use the `src/scripts/restore.ps1` script.

**Usage:**

```powershell
pnpm run restore -- -BackupFile ./backups/backup_20260309_120000.sql
```

**WARNING**: The restoration process will overwrite existing tables in the `public` schema. Ensure you have a current snapshot before restoring an older one.

## Disaster Scenarios

### 1. Database Connection Failure

- Check `src/config/database.ts` environment variables.
- Run `SELECT 1` via `psql` to verify service availability.
- Check connection pool status via the health check endpoint.

### 2. Accidental Data Deletion

- Identify the deletion timestamp.
- Restore from the closest backup _prior_ to that timestamp.
- Inform affected users of potential data lag.

### 3. Server Failure

- Re-provision the PostgreSQL instance.
- Run initial migrations found in `e:\fullstack-bootcamp\database\integrations\src\db\migrations`.
- Restore the latest backup.
