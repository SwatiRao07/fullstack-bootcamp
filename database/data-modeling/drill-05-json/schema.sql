-- 1. Add metadata JSONB column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Store flexible data with Indian context
-- Assuming we have a task with id 1, or let's update all for demo
UPDATE tasks 
SET metadata = '{"priority": "high", "tags": ["important", "home"], "due_date": "2024-01-15"}'::jsonb
WHERE id = 1;

-- 3. Query tasks by JSON field: WHERE metadata->>'priority' = 'high'
SELECT id, title, metadata->>'priority' as priority
FROM tasks
WHERE metadata->>'priority' = 'high';

-- 4. Update JSON data: UPDATE tasks SET metadata = metadata || '{"completed_at": "..."}'
UPDATE tasks 
SET metadata = metadata || '{"completed_at": "2026-03-09T19:20:00Z"}'::jsonb
WHERE id = 1;

-- 5. Index on JSON field for performance: CREATE INDEX ON tasks USING gin(metadata)
CREATE INDEX IF NOT EXISTS tasks_metadata_gin_idx ON tasks USING gin(metadata);
