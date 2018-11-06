DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name varchar (50) NULL,
    department_name varchar (50) NULL,
    price INTEGER (50) NULL,
    stock_quantity INTEGER (50) NULL,
    PRIMARY KEY (item_id)
);



