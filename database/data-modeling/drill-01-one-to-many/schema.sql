CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color TEXT
);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- Insert categories: "Work", "Personal", "Shopping"
INSERT INTO categories (name, color) 
VALUES ('Work', 'blue'), ('Personal', 'green'), ('Shopping', 'orange')
ON CONFLICT (name) DO NOTHING;

-- Update existing tasks to belong to categories (example data)
UPDATE tasks SET category_id = (SELECT id FROM categories WHERE name = 'Work')
WHERE category_id IS NULL;

-- Query tasks grouped by category name
SELECT c.name as category_name, COUNT(t.id) as task_count
FROM categories c
LEFT JOIN tasks t ON c.id = t.category_id
GROUP BY c.name;
