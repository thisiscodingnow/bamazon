-- DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;


CREATE TABLE products(
    item_id INTEGER NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100),
    department_name VARCHAR(100),
	price DECIMAL(10,2) ,
    stock_quantity INTEGER,
    product_sales DECIMAL(10,2),
	PRIMARY KEY (item_id)
);

CREATE TABLE departments(
    	department_id INTEGER NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100),
    	over_head_costs DECIMAL(10,2) ,
	PRIMARY KEY (department_id)
);




INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
('A Brief History of Time (Stephen Hawking)', 'Books', 20.00, 1000),
('HTML and CSS (Jon Duckett)', 'Books', 25.00, 2000),
('Javascript & jQuery (Jon Duckett)', 'Books', 40.00, 1500),
('flush drive', 'Computer Accessories', 25.00, 3000),
('beets-headphone', 'Electronics', 400, 1000),
('highlighter(6-pack)', 'Office supplies', 5.00, 1000),
('calculator', 'Office supplies', 30.00, 200),
('printer', 'Office supplies', 90.00, 150),
('Apple TV ', 'Entertainment', 1200, 50),
('wireless mouse', 'Computer Accessories', 12.00, 400);



SELECT * FROM products;

