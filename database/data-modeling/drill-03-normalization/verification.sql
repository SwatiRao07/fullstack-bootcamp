-- Drill Set 3: Practical Normalization (Verification)

-- 4. Update customer email in one place, verify it updates for all orders
UPDATE customers 
SET email = 'aarav_new@example.com' 
WHERE name = 'Aarav Patel';

-- Verify:
-- In denormalized, we'd have to update every row.
-- Here, one update changes the associated identity for all her orders.
SELECT c.name, c.email, o.product_name
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE c.name = 'Aarav Patel';

-- 5. Compare query complexity
-- Normalized approach query (simple join):
-- SELECT c.name, SUM(o.price) FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name;

-- Denormalized approach query (simple agg but brittle data):
-- SELECT customer_name, SUM(price) FROM orders_denormalized GROUP BY customer_name;
