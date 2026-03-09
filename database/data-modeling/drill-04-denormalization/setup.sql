-- Add task_count column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS task_count INTEGER DEFAULT 0;

-- Initialize task_count for existing users
UPDATE users u
SET task_count = (SELECT COUNT(*) FROM tasks WHERE user_id = u.id);

-- Create a function to update task count when tasks are added/removed
CREATE OR REPLACE FUNCTION update_user_task_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE users SET task_count = task_count + 1 WHERE id = NEW.user_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE users SET task_count = task_count - 1 WHERE id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trg_update_task_count ON tasks;
CREATE TRIGGER trg_update_task_count
AFTER INSERT OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_user_task_count();

-- Compare performance: counting tasks live vs. using stored count
-- Live Count: SELECT u.email, (SELECT COUNT(*) FROM tasks WHERE user_id = u.id) FROM users u;
-- Stored Count: SELECT u.email, u.task_count FROM users u;

-- Script to insert 1000 dummy tasks for user 1 (if exists)
DO $$
BEGIN
    FOR i IN 1..1000 LOOP
        INSERT INTO tasks (title, user_id) VALUES ('Task ' || i, 1);
    END LOOP;
END $$;

