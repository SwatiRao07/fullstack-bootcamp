CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Create a junction table task_tags
CREATE TABLE IF NOT EXISTS task_tags (
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- Insert tags: "urgent", "home", "office"
INSERT INTO tags (name) VALUES ('urgent'), ('home'), ('office')
ON CONFLICT (name) DO NOTHING;

-- Assign multiple tags to tasks through the junction table
INSERT INTO task_tags (task_id, tag_id)
SELECT t.id, g.id
FROM tasks t, tags g
WHERE t.id = 1 AND g.name IN ('urgent', 'office')
ON CONFLICT DO NOTHING;

-- Query all tasks with their associated tag names
SELECT t.title as task_title, STRING_AGG(g.name, ', ') as tag_names
FROM tasks t
LEFT JOIN task_tags tt ON t.id = tt.task_id
LEFT JOIN tags g ON tt.tag_id = g.id
GROUP BY t.id, t.title;
