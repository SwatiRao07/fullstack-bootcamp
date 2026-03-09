-- 1. Start with a denormalized orders table
CREATE TABLE IF NOT EXISTS orders_denormalized (
    id SERIAL PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    product_name TEXT,
    price DECIMAL(10,2)
);

-- 2. Insert several orders for the same customer - notice duplication
INSERT INTO orders_denormalized (customer_name, customer_email, product_name, price)
VALUES 
('Aarav Patel', 'aarav@example.com', 'Laptop', 1200.00),
('Aarav Patel', 'aarav@example.com', 'Mouse', 25.00),
('Ishaan Sharma', 'ishaan@example.com', 'Keyboard', 50.00);

