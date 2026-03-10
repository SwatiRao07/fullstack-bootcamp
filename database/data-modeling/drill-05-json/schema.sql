-- 
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 
UPDATE tasks 
SET metadata = '{"priority": "high", "tags": ["important", "home"], "due_date": "2024-01-15"}'::jsonb
WHERE id = 1;

-- 
SELECT id, title, metadata->>'priority' as priority
FROM tasks
WHERE metadata->>'priority' = 'high';

-- 
UPDATE tasks 
SET metadata = metadata || '{"completed_at": "2026-03-09T19:20:00Z"}'::jsonb
WHERE id = 1;

-- 
CREATE INDEX IF NOT EXISTS tasks_metadata_gin_idx ON tasks USING gin(metadata);
