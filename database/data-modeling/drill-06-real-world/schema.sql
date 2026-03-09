CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}'::jsonb
);

-- Get project details with task titles and latest comments
SELECT 
    p.name AS project_name, 
    t.title AS task_title, 
    c.content AS last_comment,
    c.created_at AS comment_date
FROM projects p
JOIN tasks t ON p.id = t.project_id
LEFT JOIN LATERAL (
    SELECT content, created_at 
    FROM comments 
    WHERE task_id = t.id 
    ORDER BY created_at DESC 
    LIMIT 1
) c ON true;
