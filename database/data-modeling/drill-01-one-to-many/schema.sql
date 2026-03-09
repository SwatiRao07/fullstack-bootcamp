-- Drill Set 1: One-to-Many Relationships

-- 1. Create a categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color TEXT
);

-- 2. Extend tasks table with category_id foreign key
-- We add it as nullable so existing tasks don't break immediately
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- 3. Insert categories: "Work", "Personal", "Shopping"
INSERT INTO categories (name, color) 
VALUES ('Work', 'blue'), ('Personal', 'green'), ('Shopping', 'orange')
ON CONFLICT (name) DO NOTHING;

-- 4. Update existing tasks to belong to categories (example data)
-- Assuming some tasks exist; we'll link them to the first category if they have no category
UPDATE tasks SET category_id = (SELECT id FROM categories WHERE name = 'Work')
WHERE category_id IS NULL;

-- 5. Query tasks grouped by category name
SELECT c.name as category_name, COUNT(t.id) as task_count
FROM categories c
LEFT JOIN tasks t ON c.id = t.category_id
GROUP BY c.name;
