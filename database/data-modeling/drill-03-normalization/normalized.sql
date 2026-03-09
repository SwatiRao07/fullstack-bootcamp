-- Normalize into customers and orders tables with foreign key

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Migrate data from orders_denormalized to normalized tables
-- Insert unique customers
INSERT INTO customers (name, email)
SELECT DISTINCT customer_name, customer_email
FROM orders_denormalized
ON CONFLICT (email) DO NOTHING;

-- Insert orders linking to customers
INSERT INTO orders (customer_id, product_name, price)
SELECT c.id, d.product_name, d.price
FROM orders_denormalized d
JOIN customers c ON d.customer_email = c.email;
